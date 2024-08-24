import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <AppBar position="fixed" sx={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
            }}> {/* Add position="fixed" */}
                <Toolbar>
                    <Link href="/" style={{ textDecoration: "none", color: "white" }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "Orbitron" }}>
                            AstroRate
                        </Typography>
                    </Link>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default Navbar;