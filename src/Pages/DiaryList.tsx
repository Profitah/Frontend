import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/DiaryList.less';
import Navbar from './Navbar';
import { Link, useLocation } from 'react-router-dom';

interface DiaryPost {
  diaryId: number;
  title: string;
}

function DiaryList() {
  const location = useLocation();
  const [storedPosts, setStoredPosts] = useState<DiaryPost[]>([]);
  
  const getDateFromUrl = () => {
    const pathArr = location.pathname.split('/');
    return pathArr[pathArr.length - 1]; 
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const date = getDateFromUrl();

    axios.get(`http://localhost:8080/diary/list?date=${date}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const postsWithId = response.data.map((post: any) => ({
          diaryId: post.diaryId,
          title: post.title
        }));
        setStoredPosts(postsWithId);
      })
      .catch(error => console.error('데이터를 불러오는 동안 오류가 발생했습니다:', error));
  }, [location.pathname]);
  
  return (
    <div className="diary-container">
      <Navbar />
      <DiaryTable storedPosts={storedPosts} />
    </div>
  );
}

interface DiaryTableProps {
  storedPosts: DiaryPost[];
}

function DiaryTable({ storedPosts }: DiaryTableProps) {
  const location = useLocation();
  return (
    <div className="diary-table-wrap">
      <table className='diarylist-table'>
        <thead>
          <tr>
            <th className="diary-table-header">No</th>
            <th className="diary-table-header">Title</th>
          </tr>
        </thead>
        <tbody>
          {storedPosts.map((post, index) => (
            <DiaryTableRow key={index} post={post} />
          ))}
        </tbody>
      </table>
      <div className='diary-write-btn'>
        <Link to={`${location.pathname}/diary/save`}>
          <button className="diary-write-button">글 작성</button>
        </Link>
      </div>
    </div>
  );
}

interface DiaryTableRowProps {
  post: DiaryPost;
}

function DiaryTableRow({ post }: DiaryTableRowProps) {
  const location = useLocation();
  return (
    <tr className="diary-table-row">
      <td className="diary-table-data">{post.diaryId}</td>
      <td className="diary-table-data">
        <Link to={`${location.pathname}/diary/findByUserAndDate?date=${post.diaryId}`} className="boardTextLink">
          {post.title}
        </Link>
      </td>
    </tr>
  );
}

export default DiaryList;
