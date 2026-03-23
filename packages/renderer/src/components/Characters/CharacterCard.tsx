import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { Character, CharacterAttributeDefinition } from '@xtory/shared';

interface CharacterCardProps {
  character: Character;
  attributesToShow?: CharacterAttributeDefinition[];
  onClick?: (character: Character) => void;
  variant?: 'compact' | 'normal' | 'expanded';
}

export default function CharacterCard({
  character,
  attributesToShow = [],
  onClick = undefined,
  variant = 'normal',
}: CharacterCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(character);
    }
  };

  const avatarSrc = character.avatarUuid
    ? `resource://${character.avatarUuid}`
    : undefined;

  const displayAttributes = attributesToShow.filter((attr) => attr.showInCard);

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        height: variant === 'compact' ? 'auto' : '100%',
        display: 'flex',
        flexDirection: variant === 'expanded' ? 'row' : 'column',
        '&:hover': onClick
          ? {
              boxShadow: 6,
            }
          : {},
      }}
    >
      {avatarSrc && (
        <CardMedia
          component="img"
          sx={{
            aspectRatio: '1 / 1',
            width: variant === 'expanded' ? 200 : '100%',
            maxHeight: variant === 'compact' ? 80 : undefined,
            objectFit: 'contain',
            backgroundColor: (theme) => theme.palette.background.default,
          }}
          image={avatarSrc}
          alt={character.name}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          gutterBottom
          variant={variant === 'compact' ? 'body1' : 'h6'}
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
          }}
        >
          {character.name}
        </Typography>

        {variant !== 'compact' && displayAttributes.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
            {displayAttributes.map((attr) => {
              const value = character.attributes[attr.key];
              if (value === undefined || value === null || value === '') {
                return null;
              }

              let displayValue = String(value);
              if (attr.type === 'boolean') {
                displayValue = value ? '✓' : '✗';
              }

              return (
                <Chip
                  key={attr.key}
                  label={`${attr.label}: ${displayValue}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    maxWidth: '100%',
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
