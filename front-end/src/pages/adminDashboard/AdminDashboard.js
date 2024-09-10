import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  CssBaseline,
  Box,
  Collapse,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import CollectionsIcon from '@mui/icons-material/Collections';
import CategoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/Discount';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ViewListIcon from '@mui/icons-material/ViewList';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Logo from "../../components/common/header/headerComponents/Logo";
import LogIn from "./auth/LogIn";
import CategoryTable from "./tables/CategoryTable";
import ProductTable from "./tables/ProductTable";
import CustomerTable from "./tables/CustomerTable";
import VoucherTable from "./tables/VoucherTable";
import CollectionTable from "./tables/CollectionTable";
import OrderTable from "./tables/OrderTable";

const drawerWidth = 240;
const collapsedDrawerWidth = 60; // Define a minimal width for collapsed drawer

export default function AdminDashboard() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const [menuOpen, setMenuOpen] = useState(true); // State to manage menu collapse
    const [userState, setUserState] = useState({
        isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
        userEmail: sessionStorage.getItem('userEmail') || ''
    });

     // Update user state
     const updateAdminDashboardState = (newState) => {
        setUserState(newState);
    };

    // Handle menu collapse
    const handleMenuClick = () => {
        setMenuOpen(!menuOpen); // Toggle menu open state
    };

    const menuItems = [
        userState.isLoggedIn
            ? { text: userState.userEmail, icon: <LockOpenIcon />, disable: true}
            : { text: "Đăng Nhập", icon: <LockOpenIcon />, content: <LogIn updateAdminDashboardState={updateAdminDashboardState}/>},
        // Conditionally include the following menu items based on user login status
        ...userState.isLoggedIn ? [
            { text: 'Loại Sản Phẩm', icon: <CategoryIcon />, content: <CategoryTable />},
            { text: 'Voucher', icon: <DiscountIcon />, content: <VoucherTable />},
            { text: 'Bộ Sưu Tập', icon: <CollectionsIcon />, content: <CollectionTable />},
            { text: "Sản Phẩm", icon: <InventoryIcon />, content: <ProductTable />},
            { text: 'Khách Hàng', icon: <EmojiPeopleIcon />, content: <CustomerTable />},
            { text: 'Đơn Hàng', icon: <ViewListIcon />, content: <OrderTable /> }
        ] : []    
    ];

    // Handle menu item click
    const handleMenuItemClick = (text, item) => {
        setSelectedMenuItem(text);
    };

    // Get selected menu item content
    const getSelectedContent = () => {
        const menuItem = menuItems.find(item => item.text === selectedMenuItem);
        return menuItem && menuItem.content ? menuItem.content : "Welcome";
    };

    // Handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        setUserState({ isLoggedIn: false, userEmail: '' });
        // Any additional logout logic
    };

    // Set initial user state
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const userEmail = sessionStorage.getItem('userEmail') || '';
        setUserState({ isLoggedIn, userEmail });
    }, []);

    return (
        <Box sx={{ display: 'flex'}}>
            <CssBaseline />
            <AppBar position="fixed" sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                width: `calc(100% - ${menuOpen ? drawerWidth : collapsedDrawerWidth}px)`,
            }}>
                <Toolbar sx={{ backgroundColor: 'black' }}>
                    <Logo imagePath="https://github.com/goldenpig17/TAN_Images/blob/main/Logo/logo%20tan%20Tr%E1%BA%AFng.png?raw=true"/>
                    {userState.isLoggedIn && (
                        <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
                            Đăng Xuất
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: menuOpen ? drawerWidth : collapsedDrawerWidth,
                    '& .MuiDrawer-paper' : {
                        width: menuOpen ? drawerWidth: collapsedDrawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem onClick={handleMenuClick}>
                            <ListItemIcon>
                                <MenuIcon />
                            </ListItemIcon>
                            <ListItemText primary="Menu" />
                            {menuOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    </List>
                    <Collapse in={menuOpen} timeout="auto" unmountOnExit>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} onClick={() => handleMenuItemClick(item.text)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </Collapse>
                </Box>
            </Drawer>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                width: `calc(100% - ${menuOpen ? drawerWidth : collapsedDrawerWidth})px`,
                marginLeft: menuOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
            }}>
                <Toolbar />
                {getSelectedContent()}
            </Box>
        </Box>
    );
}