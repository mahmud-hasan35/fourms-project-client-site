import { useState } from "react";
import BannerALL from "../../components/home/BannerALL";
import AllTag from "../../components/home/AllTag";
import Announcement from "../../components/home/Announcement";
import PostList from "../../components/home/PostList";



function HomeALL() {
   const [selectedTag, setSelectedTag] = useState("");
   return (
      <>
         
         <BannerALL />
         <AllTag onTagClick={setSelectedTag} />
         <Announcement />
         <PostList selectedTag={selectedTag}></PostList>
         
      </>
   );
}

export default HomeALL;