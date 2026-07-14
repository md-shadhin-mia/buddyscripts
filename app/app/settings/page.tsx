"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import DesktopNav from "@/components/feed/DesktopNav";
import MobileHeader from "@/components/feed/MobileHeader";
import MobileBottomNav from "@/components/feed/MobileBottomNav";

export default function SettingsPage() {
  const { user } = useAuth();

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
                <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24">
                  <h3 style={{ color: "var(--color6)", fontWeight: 600, marginBottom: 24 }}>Settings</h3>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "var(--color4)", fontWeight: 500, marginBottom: 4 }}>Email</label>
                    <p style={{ color: "var(--color)", fontSize: 15 }}>{user?.email || "—"}</p>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "var(--color4)", fontWeight: 500, marginBottom: 4 }}>Name</label>
                    <p style={{ color: "var(--color)", fontSize: 15 }}>{user?.name || "—"}</p>
                  </div>
                  <hr style={{ borderColor: "var(--bcolor1)" }} />
                  <p style={{ color: "var(--color7)", fontSize: 14 }}>More settings coming soon.</p>
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
