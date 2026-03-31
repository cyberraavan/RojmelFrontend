import { useState } from 'react';
import {
  Dashboard as DashboardIcon,
  AddBox,
  Person,
  LocalShipping,
  Inventory,
  LocationCity,
  Assignment,
  Logout,
  AdminPanelSettings,
  Download,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Drawer, IconButton, AppBar, Toolbar, Box } from '@mui/material';

const allMenuItems = [
  { name: 'Dashboard', icon: DashboardIcon, path: '/dashboard', adminOnly: true },
  { name: 'Add Shipments', icon: AddBox, path: '/add-shipments', adminOnly: true },
  { name: 'Add Party', icon: Person, path: '/add-party', adminOnly: true },
  { name: 'Add Goods Types', icon: Inventory, path: '/add-goods-types', adminOnly: true },
  { name: 'Add Lorry', icon: LocalShipping, path: '/add-lorry', adminOnly: true },
  { name: 'Add City', icon: LocationCity, path: '/add-city', adminOnly: true },
  { name: 'View Logs', icon: Assignment, path: '/view-logs', adminOnly: false },
  { name: 'DOWNLOAD', icon: Download, path: '/download', adminOnly: true },
  { name: 'Admin Panel', icon: AdminPanelSettings, path: '/admin-panel', adminOnly: true }
];

export default function SidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const role = localStorage.getItem('role') || 'admin';
  const menuItems = allMenuItems.filter(item => !item.adminOnly || role === 'admin');

  const drawerContent = (
    <div className="bg-[#1565C0] text-white flex flex-col h-full shrink-0">
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">DAILY ORDERBOOK</h1>
          <p className="text-sm text-blue-100 mt-1">(LOGBOOK)</p>
        </div>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');

          return (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${isActive
                ? 'bg-white/20 text-white'
                : 'text-blue-100 hover:bg-white/10'
                }`}
            >
              <Icon />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-blue-100 hover:bg-red-500/20 hover:text-white"
        >
          <Logout />
          <span>Logout</span>
        </button>
      </div>

      <div className="p-6 pt-2 text-sm text-blue-100">
        <p>Version 1.1.0</p>
        <p className="mt-1">© 2026 Rojmel Transport LogBook</p>
      </div>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'white' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          boxShadow: 'none',
          bgcolor: '#1565C0',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <div className="font-bold text-lg">ROJMEL Transport</div>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: 260 }, flexShrink: { md: 0 } }}
      >
        {/* Mobile / Tablet Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, border: 'none', bgcolor: '#1565C0' },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none', bgcolor: '#1565C0' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - 260px)` },
          overflow: 'auto',
          mt: { xs: '56px', sm: '64px', md: 0 },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
