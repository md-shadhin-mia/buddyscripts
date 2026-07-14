"use client";

import { IconSearch, IconHome, IconUsers, IconChat } from "../icons";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";

export default function DesktopNav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
      <div className="container _custom_container">
        <div className="_logo_wrap">
          <Link className="navbar-brand" href="feed.html">
            <img src="/images/logo.svg" alt="Image" className="_nav_logo" />
          </Link>
        </div>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="_header_form ms-auto">
            <form className="_header_form_grp">
              <IconSearch className="_header_form_svg" />
              <input
                className="form-control me-2 _inpt1"
                type="search"
                placeholder="input search text"
                aria-label="Search"
              />
            </form>
          </div>
          <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
            <li className="nav-item _header_nav_item">
              <Link
                className="nav-link _header_nav_link_active _header_nav_link"
                aria-current="page"
                href="feed.html"
              >
                <IconHome />
              </Link>
            </li>
            <li className="nav-item _header_nav_item">
              <Link
                className="nav-link _header_nav_link"
                aria-current="page"
                href="friend-request.html"
              >
                <IconUsers />
              </Link>
            </li>
            <li className="nav-item _header_nav_item">
              <NotificationsDropdown />
            </li>
            <li className="nav-item _header_nav_item">
              <Link
                className="nav-link _header_nav_link"
                aria-current="page"
                href="chat.html"
              >
                <IconChat /> <span className="_counting">2</span>
              </Link>
            </li>
          </ul>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
