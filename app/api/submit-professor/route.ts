import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});
const pc = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Validate the URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, message: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Scrape the data
    const scrapedData = await scrapeRateMyProfessor(url);

    // Create embedding
    const embedding = await createEmbedding(scrapedData.review);

    // Insert into Pinecone
    await insertIntoPinecone(scrapedData, embedding);

    return NextResponse.json({
      success: true,
      message: "Professor data added successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during processing" },
      { status: 500 }
    );
  }
}

async function scrapeRateMyProfessor(url: string) {
  try {
    // Fetching the page HTML
    const { data } = await axios.get(url);

    // Loading the HTML into cheerio
    const $ = cheerio.load(data);

    // Updated selectors based on the provided class names
    const nameDiv = $("div.NameTitle__Name-dowf0z-0.cfjPUG");
    const firstName = nameDiv.find("span").first().text().trim();
    const lastName = nameDiv.find("span").last().text().trim();
    const professor = `${firstName} ${lastName}`;
    const department = $(
      "a.TeacherDepartment__StyledDepartmentLink-fl79e8-0.iMmVHb"
    )
      .text()
      .trim();
    const ratingText = $("div.RatingValue__Numerator-qw8sqy-2.liyUjw")
      .text()
      .trim();
    const rating = parseFloat(ratingText);

    // Collect all review texts from <li> elements
    const reviews = $("ul.RatingsList__RatingsUL-hn9one-0.cbdtns li")
      .map((i, el) => $(el).text().trim())
      .get()
      .join(" ");

    if (!professor) throw new Error("Professor name not found");
    if (!department) throw new Error("Department not found");
    if (isNaN(rating)) throw new Error("Rating not found or is not a number");
    if (!reviews) throw new Error("Reviews not found");

    return { professor, subject: department, stars: rating, review: reviews };
  } catch (error) {
    console.error("Error scraping data:", error);
    throw new Error("Failed to scrape data from the provided URL");
  }
}

async function createEmbedding(text: string) {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return embeddingResponse.data[0].embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw new Error("Failed to create embedding for the review text");
  }
}

async function insertIntoPinecone(data: any, embedding: number[]) {
  try {
    const index = pc.index("rag").namespace("ns1");

    const metadata = {
      subject: data.subject || "Unknown",
      stars: typeof data.stars === "number" ? data.stars : 0,
      review: data.review || "No review available",
    };

    // Ensure the id is unique and valid
    const id = data.professor || `${Date.now()}-${Math.random()}`; // Fallback to a unique id if professor is empty

    await index.upsert([
      {
        id: id,
        values: embedding,
        metadata: metadata,
      },
    ]);
  } catch (error) {
    console.error("Error inserting into Pinecone:", error);
    throw new Error("Failed to insert data into Pinecone");
  }
}

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
