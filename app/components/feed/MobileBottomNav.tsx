"use client";

import React from "react";
import {
  IconHomeMobile,
  IconUsersMobile,
  IconBellMobile,
  IconChatMobile,
  IconMenu,
} from "../icons";
import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <div className="_mobile_navigation_bottom_wrapper">
      <div className="_mobile_navigation_bottom_wrap">
          <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <ul className="_mobile_navigation_bottom_list">
                <li className="_mobile_navigation_bottom_item">
                  <Link
                    href="feed.html"
                    className="_mobile_navigation_bottom_link _mobile_navigation_bottom_link_active"
                  >
                    <IconHomeMobile />
                  </Link>
                </li>
                <li className="_mobile_navigation_bottom_item">
                  <Link
                    href="friend-request.html"
                    className="_mobile_navigation_bottom_link"
                  >
                    <IconUsersMobile />
                  </Link>
                </li>
                <li className="_mobile_navigation_bottom_item">
                  <Link href="no" className="_mobile_navigation_bottom_link">
                    <IconBellMobile />
                    <span className="_counting">6</span>
                  </Link>
                </li>
                <li className="_mobile_navigation_bottom_item">
                  <Link
                    href="chat_list(for_mbl).html"
                    className="_mobile_navigation_bottom_link"
                  >
                    <IconChatMobile />
                    <span className="_counting">2</span>
                  </Link>
                </li>
              </ul>
              <div className="_header_mobile_toggle">
                <form action="/mobileMenu.html">
                  <button
                    type="submit"
                    className="_header_mobile_btn_link"
                    value="go to mobile menu"
                  >
                    <IconMenu />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
