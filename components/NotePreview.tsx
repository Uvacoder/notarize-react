import * as React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNotes } from './hooks';
import Spinner from './Spinner';

function NotePreview({ note, isSelected, ...props }) {
  const [displayDate, setDisplayDate] = React.useState(null);
  const { deleteMutation } = useNotes();

  React.useEffect(() => {
    setDisplayDate(
      new Date(note.dateEdited).toDateString() === new Date().toDateString()
        ? new Date(note.dateEdited).toLocaleTimeString()
        : new Date(note.dateEdited).toLocaleDateString()
    );
  }, [note]);

  return (
    <li
      className={`flex justify-between items-center gap-2 p-4 rounded ${
        isSelected && 'bg-gray-200'
      } hover:bg-gray-200 active:bg-gray-300 transition-all duration-100`}
      {...props}
    >
      <div className='flex flex-col gap-2'>
        <div className='font-serif text-lg'>{note.title}</div>
        <div className='text-sm'>{displayDate}</div>
      </div>
      {deleteMutation.status !== 'loading' ? (
        <button
          className='focus:ring ring-red-500'
          onClick={(e) => {
            e.stopPropagation();
            deleteMutation.mutate(note.id);
          }}
        >
          <svg
            className='w-6 h-6 text-red-500 hover:text-red-700'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
          <span className='sr-only'>Delete Note</span>
        </button>
      ) : (
        <span className='text-red-500'>
          <Spinner />
        </span>
      )}
    </li>
  );
}

export default NotePreview;
