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
  HomeOutlined,
  ReceiptLongOutlined,
  LockOutlined,
  LogoutOutlined,
  PersonOutline,
  ChevronLeft,
} from "@mui/icons-material";
import api from "../../../features/axios";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Footer from "@/user/pages/footer/Footer";
import Navbar from "@/user/pages/navbar/Navbar";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "@/redux/authSlice";
import { store } from "@/redux/store";

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

const Sidebar = () => {
  const theme = useTheme();
  const { sellerId, shopName } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const navigate = useNavigate();
  const location = useLocation();
const handleLogout = async () => {
  try {
    const promise = api.post("/logout");

    await toast.promise(
      promise,
      {
        loading: "Logging out...",
        success: "Logged out successfully 👋",

        error: (err) =>
          err.response?.data?.message || "Logout failed",
      },
      {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
        duration: 3500,
      }
    );

    store.dispatch(logoutUser());
    sessionStorage.clear();

    navigate(`/${sellerId}/${shopName}`);
  } catch (error: any) {
    console.log("LOGOUT ERROR 👉", error?.response?.data);
  }
};
  const menu = [
    {
      label: "Dashboard",
      icon: <HomeOutlined />,
      path: `/${sellerId}/${shopName}/dashboard`,
    },
    {
      label: "Orders",
      icon: <ReceiptLongOutlined />,
      path: `/${sellerId}/${shopName}/dashboard/orders`,
    },
    {
      label: "Change Password",
      icon: <LockOutlined />,
      path: `/${sellerId}/${shopName}/dashboard/change-password`,
    },
    {
      label: "Log out",
      icon: <LogoutOutlined />,
    },
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
              Profile
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
                   if (label === "Log out") {
                    handleLogout();
                  } else {
                    navigate(path!);

                    if (isMobile) setMobileOpen(false);
                  }
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
        <Navbar shopName={shopName!} sellerId={sellerId!} />
      </div>

      <div className="mt-[64px] bg-gray-100 px-0 p-0">
        {" "}
        <Box sx={{ display: "flex", height: "100%" }}>
          {/* MOBILE BUTTON */}
          {isMobile && !mobileOpen && (
            <Box sx={{ position: "relative" }}>
              {" "}
              {/* parent relative */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  position: "absolute", // changed from fixed
                  top: 16, // adjust vertical position
                  left: 12, // adjust horizontal
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

          {/* DESKTOP SIDEBAR */}
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

export default Sidebar;
