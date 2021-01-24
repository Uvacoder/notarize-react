import * as React from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import MobileNav from '../components/MobileNav';
import Button from '../components/Button';
import NotePreview from '../components/NotePreview';
import Note from '../components/Note';
import type { Note as INote } from '../types/Note';
import { useNotes } from '../components/context/NotesContext';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import prisma from '../lib/prisma';

export default function Home({ notes }) {
  // const [notes, setNotes]: [INote[], React.Dispatch<INote[]>] = useNotes();

  const [selectedNote, setSelectedNote] = React.useState(notes[0]);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    if (!notes[0]) {
      setSelectedNote(null);
    } else if (!notes.find((n) => n.id === selectedNote?.id)) {
      setSelectedNote(null);
    }
  }, [notes]);

  return (
    <div>
      <Head>
        <title>Notarize</title>
      </Head>
      <main>
        <MobileNav selectedNote={selectedNote} />
        <div className='grid min-h-screen grid-cols-1 p-8 lg:grid-cols-4 lg:gap-4'>
          <ul className='row-start-3 space-y-4 lg:pr-8 lg:row-start-auto lg:border-r'>
            <label htmlFor='searchNotes' className='sr-only'>
              Search Notes
            </label>
            <input
              id='searchNotes'
              className='w-full p-2 bg-gray-100 rounded focus:ring'
              type='text'
              placeholder='Search...'
              onChange={(e) => setSearchText(e.target.value)}
            />
            {notes ? (
              notes
                .filter((note) => note.title.toLowerCase().includes(searchText))
                .map((note) => (
                  <NotePreview
                    key={note.id}
                    note={note}
                    isSelected={selectedNote === note}
                    onClick={() => setSelectedNote(note)}
                  />
                ))
            ) : (
              <li>No notes yet!</li>
            )}
            <Button
              type='primary'
              className='flex items-center justify-center w-full'
              onClick={() =>
                fetch('/api/notes', {
                  body: JSON.stringify({
                    title: 'New Note',
                    content: 'Put Markdown here!',
                  }),
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
              }
            >
              <svg
                className='w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              Add Note
            </Button>
          </ul>
          <div className='px-4 lg:col-span-2'>
            {selectedNote ? (
              <Note
                note={notes.find((n) => n.id === selectedNote.id)}
                index={notes.indexOf(
                  notes.find((n) => n.id === selectedNote.id)
                )}
              />
            ) : (
              <React.Fragment />
            )}
          </div>

          <div className='flex flex-col justify-end row-start-4 lg:row-start-auto lg:justify-between lg:border-l'>
            <Nav selectedNote={selectedNote} />
            <footer className='w-full text-sm text-center text-gray-500'>
              Austin Crim | 2021
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const notes = await prisma.note.findMany({});
  // NextJS cannot automatically parse the postgres DateTime type
  return { props: { notes: JSON.parse(JSON.stringify(notes)) } };
}
