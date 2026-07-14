import { DarkModeToggle } from "@/components/feed/DarkModeToggle";
import FeedLayout from "@/components/feed/FeedLayout";

export default function Home() {
  return (
    <div className="_layout _layout_main_wrapper">
      <DarkModeToggle />
      <div className="_main_layout">
        <FeedLayout />
      </div>
    </div>
  );
}
