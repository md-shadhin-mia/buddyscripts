"use client";

import {
  IconLearning,
  IconInsights,
  IconFindFriends,
  IconBookmarks,
  IconGroup,
  IconGaming,
  IconSettingsGear,
  IconSavePost,
} from "../icons";
import Link from "next/link";

export default function ExploreMenu() {
  return (
    <div className="_left_inner_area_explore _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <h4 className="_left_inner_area_explore_title _title5  _mar_b24">Explore</h4>
      <ul className="_left_inner_area_explore_list">
        <li className="_left_inner_area_explore_item _explore_item">
          <Link href="#0" className="_left_inner_area_explore_link">
            <IconLearning />Learning
          </Link>
          <span className="_left_inner_area_explore_link_txt">New</span>
        </li>
        <li className="_left_inner_area_explore_item">
          <Link href="#0" className="_left_inner_area_explore_link">
            <IconInsights />Insights
          </Link>
        </li>
        <li className="_left_inner_area_explore_item">
          <Link href="find-friends.html" className="_left_inner_area_explore_link">
            <IconFindFriends />Find friends
          </Link>
        </li>
        <li className="_left_inner_area_explore_item">
          <Link href="#0" className="_left_inner_area_explore_link">
            <IconBookmarks />Bookmarks
          </Link>
        </li>
        <li className="_left_inner_area_explore_item">
          <Link href="group.html" className="_left_inner_area_explore_link">
            <IconGroup />Group
          </Link>
        </li>
        <li className="_left_inner_area_explore_item _explore_item">
          <Link href="#0" className="_left_inner_area_explore_link">
            <IconGaming />Gaming
          </Link>
          <span className="_left_inner_area_explore_link_txt">New</span>
        </li>
        <li className="_left_inner_area_explore_item">
          <Link href="#0" className="_left_inner_area_explore_link">
            <IconSettingsGear />Settings
          </Link>
        </li>
        <li className="_left_inner_area_explore_item">
          <Link href="#0" className="_left_inner_area_explore_link">
            <IconSavePost />Save post
          </Link>
        </li>
      </ul>
    </div>
  );
}
