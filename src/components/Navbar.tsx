
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { translate } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">FarmWise</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-10">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  {translate("Home")}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/products" className={navigationMenuTriggerStyle()}>
                  {translate("Products")}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  {translate("About")}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Hi, {user.email?.split('@')[0]}</span>
                <Button variant="outline" onClick={logout}>{translate("Logout")}</Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button>{translate("Login")}</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {translate("Home")}
            </Link>
            <Link
              to="/products"
              className="text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {translate("Products")}
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {translate("About")}
            </Link>
            {user ? (
              <>
                <div className="text-sm">Hi, {user.email?.split('@')[0]}</div>
                <Button variant="outline" onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}>
                  {translate("Logout")}
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button>{translate("Login")}</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
