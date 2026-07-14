"use client";

import React from "react";
import { IconSearch } from "../icons";
import Link from "next/link";

export default function FriendsList() {
  return (
    <div className="_feed_right_inner_area_card  _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_feed_top_fixed">
        <div className="_feed_right_inner_area_card_content _mar_b24">
          <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
          <span className="_feed_right_inner_area_card_content_txt">
            <Link className="_feed_right_inner_area_card_content_txt_link" href="find-friends.html">See All</Link>
          </span>
        </div>
        <form className="_feed_right_inner_area_card_form">
          <IconSearch className="_feed_right_inner_area_card_form_svg" />
          <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" aria-label="Search" />
        </form>
      </div>
      <div className="_feed_bottom_fixed">
        <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people1.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Steve Jobs</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Apple</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side"> <span>5 minute ago</span>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people2.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Ryan Roslansky</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Linkedin</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people3.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Dylan Field</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Figma</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people1.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Steve Jobs</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Apple</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side"> <span>5 minute ago</span>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people2.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Ryan Roslansky</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Linkedin</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people3.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Dylan Field</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Figma</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people1.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Steve Jobs</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Apple</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side"> <span>5 minute ago</span>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people2.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Ryan Roslansky</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Linkedin</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people3.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Dylan Field</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Figma</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people3.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Dylan Field</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Figma</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
              <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
            </svg>
          </div>
        </div>
        <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive">
          <div className="_feed_right_inner_area_card_ppl_box">
            <div className="_feed_right_inner_area_card_ppl_image">
              <Link href="profile.html">
                <img src="/images/people1.png" alt="" className="_box_ppl_img" />
              </Link>
            </div>
            <div className="_feed_right_inner_area_card_ppl_txt">
              <Link href="profile.html">
                <h4 className="_feed_right_inner_area_card_ppl_title">Steve Jobs</h4>
              </Link>
              <p className="_feed_right_inner_area_card_ppl_para">CEO of Apple</p>
            </div>
          </div>
          <div className="_feed_right_inner_area_card_ppl_side"> <span>5 minute ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
