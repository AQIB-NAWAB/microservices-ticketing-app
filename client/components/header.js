import React from "react";
import Link from "next/link";
const header = ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: "Sign Up",
      href: "/auth/signup",
      requiredUser: false,
    },
    !currentUser &&{
      label: "Sign In",
      href: "/auth/signin",
    },
    currentUser &&{
      label: "Sign Out",
      href: "/auth/signout",
    },
  ];
  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          
            {links.map((link) => {
                if (link) {
                    return (
                    <li key={link.href} className="nav-item">
                        <Link href={link.href}>
                        <span className="nav-link">{link.label}</span>
                        </Link>
                    </li>
                    );
                }
                }
            )}

        </ul>
      </div>
    </nav>
  );
};

export default header;
