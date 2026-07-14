"use client";
import Link from "next/link";

export default function SuggestedPeople() {
  return (
    <div className="_left_inner_area_suggest _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_area_suggest_content _mar_b24">
        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
        <span className="_left_inner_area_suggest_content_txt">
          <Link className="_left_inner_area_suggest_content_txt_link" href="#0">See All</Link>
        </span>
      </div>
      <div className="_left_inner_area_suggest_info">
        <div className="_left_inner_area_suggest_info_box">
          <div className="_left_inner_area_suggest_info_image">
            <Link href="profile.html">
              <img src="/images/people1.png" alt="Image" className="_info_img" />
            </Link>
          </div>
          <div className="_left_inner_area_suggest_info_txt">
            <Link href="profile.html">
              <h4 className="_left_inner_area_suggest_info_title">Steve Jobs</h4>
            </Link>
            <p className="_left_inner_area_suggest_info_para">CEO of Apple</p>
          </div>
        </div>
        <div className="_left_inner_area_suggest_info_link">
          <Link href="#0" className="_info_link">Connect</Link>
        </div>
      </div>
      <div className="_left_inner_area_suggest_info">
        <div className="_left_inner_area_suggest_info_box">
          <div className="_left_inner_area_suggest_info_image">
            <Link href="profile.html">
              <img src="/images/people2.png" alt="Image" className="_info_img1" />
            </Link>
          </div>
          <div className="_left_inner_area_suggest_info_txt">
            <Link href="profile.html">
              <h4 className="_left_inner_area_suggest_info_title">Ryan Roslansky</h4>
            </Link>
            <p className="_left_inner_area_suggest_info_para">CEO of Linkedin</p>
          </div>
        </div>
        <div className="_left_inner_area_suggest_info_link">
          <Link href="#0" className="_info_link">Connect</Link>
        </div>
      </div>
      <div className="_left_inner_area_suggest_info">
        <div className="_left_inner_area_suggest_info_box">
          <div className="_left_inner_area_suggest_info_image">
            <Link href="profile.html">
              <img src="/images/people3.png" alt="Image" className="_info_img1" />
            </Link>
          </div>
          <div className="_left_inner_area_suggest_info_txt">
            <Link href="profile.html">
              <h4 className="_left_inner_area_suggest_info_title">Dylan Field</h4>
            </Link>
            <p className="_left_inner_area_suggest_info_para">CEO of Figma</p>
          </div>
        </div>
        <div className="_left_inner_area_suggest_info_link">
          <Link href="#0" className="_info_link">Connect</Link>
        </div>
      </div>
    </div>
  );
}
