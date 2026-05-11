import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
} from "@mui/material";

import {
  DashboardOutlined,
  Inventory2Outlined,
  AddBoxOutlined,
  ShoppingCartCheckoutOutlined,
  LocalOfferOutlined,
  LockOutlined,
  LogoutOutlined,
  PersonOutline,
  ChevronLeft,
} from "@mui/icons-material";

import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Footer from "../../pages/sellerFooter/SellerFooter";
import Navbar from "../../pages/sellerNavbar/SellerNavbar";

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

const sellerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ UPDATED SELLER MENU
  const menu = [
    { label: "Dashboard", icon: <DashboardOutlined />, path: "/seller" },
    { label: "Profile", icon: <PersonOutline />, path: "/seller/profile" },
    {
      label: "Orders",
      icon: <ShoppingCartCheckoutOutlined />,
      path: "/seller/orders",
    },
    {
      label: "Add Product",
      icon: <AddBoxOutlined />,
      path: "/seller/add-product",
    },
    {
      label: "Products",
      icon: <Inventory2Outlined />,
      path: "/seller/products",
    },

    {
      label: "Category",
      icon: <LocalOfferOutlined />,
      path: "/seller/category",
    },
    {
      label: "Change Password",
      icon: <LockOutlined />,
      path: "/seller/change-password",
    },
    { label: "Log out", icon: <LogoutOutlined />, path: "/logout" },
  ];

  const drawerContent = (
    <>
      <Box
        px={2}
        py={2}
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
      >
        <IconButton
          onClick={() => collapsed && setCollapsed(false)}
          sx={{ color: "#fff" }}
        >
          <PersonOutline />
          {!collapsed && (
            <Typography ml={1} fontWeight={700}>
              Seller Panel
            </Typography>
          )}
        </IconButton>

        {!isMobile && !collapsed && (
          <IconButton onClick={() => setCollapsed(true)} sx={{ color: "#fff" }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ bgcolor: "#333" }} />

      <List>
        {menu.map(({ label, icon, path }) => {
          const active = location.pathname === path;

          return (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 0 : 2,
                  color: active ? "#000" : "#eee",
                  bgcolor: active ? "#fff" : "transparent",
                  borderRadius: "8px",
                  mb: 1,

                  "&:hover": {
                    bgcolor: active ? "#fff" : "#222",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    color: active ? "#000" : "#bbb",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>

                {!collapsed && <ListItemText primary={label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="mt-[64px] bg-gray-100 px-0 p-0">
        <Box sx={{ display: "flex", height: "100%" }}>
          {/* MOBILE BUTTON */}
          {isMobile && !mobileOpen && (
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 12,
                  zIndex: 1,
                  bgcolor: "#000",
                  color: "#fff",
                  borderRadius: "50%",
                  animation: "pulseBg 1.5s infinite",
                  "@keyframes pulseBg": {
                    "0%": { bgcolor: "#000" },
                    "50%": { bgcolor: "#b91c1c" },
                    "100%": { bgcolor: "#000" },
                  },
                }}
              >
                <PersonOutline />
              </IconButton>
            </Box>
          )}

          {/* SIDEBAR */}
          {!isMobile ? (
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  bgcolor: "#000",
                  color: "#fff",
                  transition: "width .3s",
                  overflowX: "hidden",
                  top: "64px",
                  height: "calc(100% - 64px)",
                },
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: EXPANDED_WIDTH,
                  bgcolor: "#000",
                  color: "#fff",
                  top: "64px",
                  height: "calc(100% - 64px)",
                },
              }}
            >
              {drawerContent}
            </Drawer>
          )}

          {/* PAGE CONTENT */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 0,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </div>

      <Footer />
    </div>
  );
};

export default sellerDashboard;
