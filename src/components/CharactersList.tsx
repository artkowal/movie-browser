import { useState } from 'react';
import { useCharacters } from '../hooks/useCharacters';
import { CharacterCard } from './CharacterCard';

export const CharactersList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useCharacters(page);

  if (isLoading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#000' }}>Ładowanie danych...</div>;
  if (isError) return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Błąd pobierania danych: {error.message}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px'
      }}>
        {data?.results.map((character) => (
          <CharacterCard 
            key={character.id} 
            name={character.name} 
            status={character.status} 
            image={character.image} 
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          style={{ 
            padding: '8px 16px', 
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            color: '#000',
            border: '1px solid #ccc',
            backgroundColor: page === 1 ? '#f5f5f5' : '#fff'
          }}
        >
          Poprzednia
        </button>
        
        <span style={{ fontWeight: '500', color: '#000' }}>
          Strona {page} z {data?.info.pages}
        </span>
        
        <button
          onClick={() => setPage((old) => (data?.info.next ? old + 1 : old))}
          disabled={!data?.info.next}
          style={{ 
            padding: '8px 16px', 
            cursor: !data?.info.next ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            color: '#000',
            border: '1px solid #ccc',
            backgroundColor: !data?.info.next ? '#f5f5f5' : '#fff'
          }}
        >
          Następna
        </button>
      </div>
    </div>
  );
};