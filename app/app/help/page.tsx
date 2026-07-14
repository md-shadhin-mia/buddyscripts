"use client";

import Link from "next/link";
import DesktopNav from "@/components/feed/DesktopNav";
import MobileHeader from "@/components/feed/MobileHeader";
import MobileBottomNav from "@/components/feed/MobileBottomNav";

export default function HelpPage() {
  return (
    <div className="_layout _layout_main_wrapper">
      <DesktopNav />
      <MobileHeader />
      <section className="_feed_wrapper _padd_t20" style={{ background: "var(--bg1)", minHeight: "100vh" }}>
        <div className="container _custom_container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div style={{ paddingTop: "70px" }}>
                <Link href="/" className="btn btn-outline-secondary mb-4" style={{ color: "var(--color5)", borderColor: "var(--color5)" }}>
                  &larr; Back to Feed
                </Link>
                <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
                  <h3 style={{ color: "var(--color6)", fontWeight: 600, marginBottom: 24 }}>Help &amp; Support</h3>
                  <div className="_feed_inner_text_area_box" style={{ marginBottom: 20 }}>
                    <h5 style={{ color: "var(--color6)", fontWeight: 500, marginBottom: 8 }}>FAQ</h5>
                    <p style={{ color: "var(--color7)", fontSize: 14, margin: 0 }}>
                      Frequently asked questions will appear here.
                    </p>
                  </div>
                  <hr style={{ borderColor: "var(--bcolor1)" }} />
                  <div className="_feed_inner_text_area_box" style={{ marginTop: 20 }}>
                    <h5 style={{ color: "var(--color6)", fontWeight: 500, marginBottom: 8 }}>Contact Us</h5>
                    <p style={{ color: "var(--color7)", fontSize: 14, margin: 0 }}>
                      Reach out to <a href="mailto:support@buddyscript.com" style={{ color: "var(--color5)" }}>support@buddyscript.com</a> for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MobileBottomNav />
    </div>
  );
}
