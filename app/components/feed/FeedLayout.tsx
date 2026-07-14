"use client";

import DesktopNav from "./DesktopNav";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import FeedContent from "./FeedContent";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { useAuth } from "@/lib/AuthContext";

export default function FeedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="_loading">Loading...</div>;
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <DesktopNav />
      <MobileHeader />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
          
          <div className="row">
            <LeftSidebar />
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div className="_layout_middle_wrap">
                <div className="_layout_middle_inner">

                  <FeedContent />
                </div>

              </div>
            </div>
            <RightSidebar />
          </div>
            </div>
        </div>
      <MobileBottomNav />
    </>
  );
}
