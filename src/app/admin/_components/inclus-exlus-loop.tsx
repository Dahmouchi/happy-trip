 
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Trash2 } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// interface StringLoopProps {
//   title: string;
//   type: 'inclus' | 'exclus';
//   description?: string;
// }

// const StringLoop: React.FC<StringLoopProps> = ({ title, type, description }) => {
//   const [strings, setStrings] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState<string>('');

//   const addString = (newString: string) => {
//     setStrings(prev => [...prev, newString]);
//   };

//   const removeString = (index: number) => {
//     setStrings(prev => prev.filter((_, i) => i !== index));
//   };

//   const colorScheme = type === 'inclus' 
//     ? 'bg-gray-50 ' 
//     : 'bg-gray-50 ';

//   const badgeVariant = type === 'inclus' ? 'default' : 'destructive';

//   return (
//     <Card className={`${colorScheme} h-fit`}>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           {title}
//           <Badge variant={badgeVariant}>{type}</Badge>
//         </CardTitle>
//         {description && (
//           <p className="text-sm text-gray-600">{description}</p>
//         )}
//       </CardHeader>
//       <CardContent>
//       <div className="flex gap-2">
//         <Input
//           className="w-full"
//           type="text"
//           value={inputValue}
//           onChange={e => setInputValue(e.target.value)}
//           placeholder={`Ajouter ${type} ...`}
//         />
//         <Button
//           type="button"
//           onClick={() => {
//             if (inputValue.trim()) {
//               addString(inputValue.trim());
//               setInputValue('');
//             }
//           }}
//           className='bg-lime-600 hover:bg-lime-700 text-white'
//         >
//           Ajouter
//         </Button>
//       </div>

//       {strings.length > 0 && (
//         <div className="space-y-2">
//         <h4 className="font-semibold text-sm my-2">{type} ({strings.length}):</h4>
//         <div className="max-h-60 overflow-y-auto space-y-1">
//           {strings.map((string, index) => (
//             <div 
//             key={index} 
//             className="flex items-center justify-between p-2 rounded bg-white border"
//             >
//             <span className="text-sm truncate flex-1 mr-2">{string}</span>
//             <Button
//               onClick={() => removeString(index)}
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6 text-red-500 hover:red-lime-700"
//             >
//               <Trash2 className="w-3 h-3" />
//             </Button>
//             </div>
//           ))}
//         </div>
//         </div>
//       )}

//       {strings.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//         <p>Aucune chaîne ajoutée pour le moment.</p> 
//         <p className="text-sm">Ajoutez votre première chaîne {type} ci-dessus&nbsp;!</p>  </div>
//       )}
//       </CardContent>
//     </Card>
//   );
// }
// export default StringLoop;




import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StringLoopProps {
  title: string;
  type: 'inclus' | 'exclus';
  description?: string;
  onChange: (value: string) => void; // 👈 Callback to parent
}

const StringLoop: React.FC<StringLoopProps> = ({ title, type, description, onChange }) => {
  const [strings, setStrings] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    onChange(strings.join(';'));
  }, [strings]);

  const addString = (newString: string) => {
    setStrings(prev => [...prev, newString]);
  };

  const removeString = (index: number) => {
    setStrings(prev => prev.filter((_, i) => i !== index));
  };

  const badgeVariant = type === 'inclus' ? 'default' : 'destructive';

  return (
    <Card className="bg-gray-50 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant={badgeVariant}>{type}</Badge>
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            className="w-full"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Ajouter ${type} ...`}
          />
          <Button
            type="button"
            onClick={() => {
              if (inputValue.trim()) {
                addString(inputValue.trim());
                setInputValue('');
              }
            }}
            className="bg-lime-600 hover:bg-lime-700 text-white"
          >
            Ajouter
          </Button>
        </div>

        {strings.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm my-2">
              {type} ({strings.length}):
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {strings.map((string, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-white border"
                >
                  <span className="text-sm truncate flex-1 mr-2">{string}</span>
                  <Button
                    onClick={() => removeString(index)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune chaîne ajoutée pour le moment.</p>
            <p className="text-sm">
              Ajoutez votre première chaîne {type} ci-dessus&nbsp;!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StringLoop;


