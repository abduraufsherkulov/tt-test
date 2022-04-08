import {AxiosResponse} from 'axios';
import {ChangeEvent, useState} from 'react';
import {useQuery} from 'react-query';
import axiosInstance from '../../axiosInstance';
import {ImageType} from './gallery.type';

const pageSize = 5;

function Gallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const {data, isLoading} = useQuery(
    ['gallery-images', page],
    (): Promise<AxiosResponse<ImageType[]>> =>
      axiosInstance.get(`photos?_limit=${page * pageSize}`),
    {
      keepPreviousData: true,
    }
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <h1>Gallery</h1>
      <input
        className="text-black border-2"
        value={searchQuery}
        onChange={handleChange}
        placeholder="search..."
      />
      {isLoading ? (
        '...Loading'
      ) : (
        <ul className="space-y-4">
          {data?.data
            .filter(image =>
              image.title
                .toLowerCase()
                .includes(searchQuery.toLocaleLowerCase())
            )
            .map(({id, thumbnailUrl, title}) => (
              <li key={id} className="flex items-center gap-4">
                <img src={thumbnailUrl} alt={title} className="rounded-full" />
                <p>{title}</p>
              </li>
            ))}
        </ul>
      )}
      <button
        className="border-2 p-2"
        onClick={() => setPage(prev => prev + 1)}
        disabled={isLoading}
      >
        {isLoading ? '...Loading' : 'Load more'}
      </button>
    </div>
  );
}

export default Gallery;
