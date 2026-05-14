interface CharacterCardProps {
  name: string;
  status: string;
  image: string;
}

export const CharacterCard = ({ name, status, image }: CharacterCardProps) => {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '16px', 
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={image} 
        alt={name} 
        width="150" 
        style={{ borderRadius: '50%', marginBottom: '12px' }} 
      />
      <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>{name}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
        Status: {status}
      </p>
    </div>
  );
};