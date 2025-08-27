import { NavLink } from "react-router-dom";

const SidebarLink = ({ icon: Icon, label, to, sidebarOpen }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      {sidebarOpen && <span className="text-sm">{label}</span>}
    </NavLink>
  );
};

export default SidebarLink;
