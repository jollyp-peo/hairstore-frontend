import { FiSun, FiMoon } from 'react-icons/fi';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
      className="transition-all"
      aria-label="Toggle Theme"
    >
      {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
