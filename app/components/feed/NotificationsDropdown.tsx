"use client";

import { Menu } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";
import { IconBell, IconThreeDots } from "../icons";
import { useNotifications, useUnreadCount, useMarkAllRead } from "@/hooks/useNotifications";

export default function NotificationsDropdown() {
  const { data } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAllRead = useMarkAllRead();
  const [subOpen, setSubOpen] = useState(false);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (subRef.current && !subRef.current.contains(e.target as Node)) {
        setSubOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = data?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  return (
    <Menu as="div" className="nav-link _header_nav_link _header_notify_btn">
      <Menu.Button className="_header_notify_btn">
        <IconBell />
      </Menu.Button>
      {unreadCount > 0 && <span className="_counting">{unreadCount}</span>}
      <Menu.Items
        className={({ open }) =>
          "_notification_dropdown" + (open ? " show" : "")
        }
        unmount={false}
      >
        <div className="_notifications_content">
          <h4 className="_notifications_content_title">Notifications</h4>
          <div className="_notification_box_right" ref={subRef}>
            <button
              type="button"
              className="_notification_box_right_link"
              onClick={() => setSubOpen((prev) => !prev)}
            >
              <IconThreeDots />
            </button>
            <div className={"_notifications_drop_right" + (subOpen ? " show" : "")}>
              <ul className="_notification_list">
                <li className="_notification_item">
                  <span className="_notification_link" onClick={() => markAllRead.mutate()} style={{cursor: "pointer"}}>Mark as all read</span>
                </li>
                <li className="_notification_item">
                  <span className="_notification_link">
                    Notifications settings
                  </span>
                </li>
                <li className="_notification_item">
                  <span className="_notification_link">Open Notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="_notifications_drop_box">
          <div className="_notifications_drop_btn_grp">
            <button className="_notifications_btn_link">All</button>
            <button className="_notifications_btn_link1">Unread</button>
          </div>
          <div className="_notifications_all">
            {notifications.length === 0 && (
              <div className="_notification_box">
                <div className="_notification_txt">
                  <p className="_notification_para">No notifications yet.</p>
                </div>
              </div>
            )}
            {notifications.map((n) => {
              const timeAgo = getTimeAgo(n.createdAt);
              return (
                <div className="_notification_box" key={n.id}>
                  <div className="_notification_image">
                    <img
                      src={n.actor?.avatar || "/images/friend-req.png"}
                      alt="Image"
                      className="_notify_img"
                    />
                  </div>
                  <div className="_notification_txt">
                    <p className="_notification_para">
                      <span className="_notify_txt_link">{n.actor?.name}</span>{" "}
                      {n.message || n.type}
                    </p>
                    <div className="_nitification_time">
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Menu.Items>
    </Menu>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
