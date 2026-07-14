"use client";

import { Menu } from "@headlessui/react";
import {
  IconChevronDown,
  IconChevronRight,
  IconSettings,
  IconHelp,
  IconLogout,
} from "../icons";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();

  return (
    <Menu as="div" className="_header_nav_profile">
      <Menu.Button className="_header_nav_dropdown_btn _dropdown_toggle _header_nav_profile">
        <div className="_header_nav_profile_image">
          <img src={user?.avatar || "/images/profile.png"} alt="Image" className="_nav_profile_img" />
        </div>
        <div className="_header_nav_dropdown">
          <p className="_header_nav_para">{user?.name || "User"}</p>
          <IconChevronDown />
        </div>
      </Menu.Button>
      <Menu.Items
        className={({ open }) =>
          "_nav_profile_dropdown _profile_dropdown" + (open ? " show" : "")
        }
        unmount={false}
      >
        <div className="_nav_profile_dropdown_info">
          <div className="_nav_profile_dropdown_image">
            <img src={user?.avatar || "/images/profile.png"} alt="Image" className="_nav_drop_img" />
          </div>
          <div className="_nav_profile_dropdown_info_txt">
            <h4 className="_nav_dropdown_title">{user?.name || "User"}</h4>
            <Link href="/profile" className="_nav_drop_profile">View Profile</Link>
          </div>
        </div>
        <hr />
        <ul className="_nav_dropdown_list">
          <Menu.Item as="li" className="_nav_dropdown_list_item">
            <Link href="/settings" className="_nav_dropdown_link">
              <div className="_nav_drop_info">
                <span><IconSettings /></span>
                Settings
              </div>
              <span className="_nav_drop_btn_link">
                <IconChevronRight />
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item as="li" className="_nav_dropdown_list_item">
            <Link href="/help" className="_nav_dropdown_link">
              <div className="_nav_drop_info">
                <span><IconHelp /></span>
                Help & Support
              </div>
              <span className="_nav_drop_btn_link">
                <IconChevronRight />
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item as="li" className="_nav_dropdown_list_item">
            <button type="button" className="_nav_dropdown_link" onClick={() => logout()} style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}>
              <div className="_nav_drop_info">
                <span><IconLogout /></span>
                Log Out
              </div>
              <span className="_nav_drop_btn_link">
                <IconChevronRight />
              </span>
            </button>
          </Menu.Item>
        </ul>
      </Menu.Items>
    </Menu>
  );
}
