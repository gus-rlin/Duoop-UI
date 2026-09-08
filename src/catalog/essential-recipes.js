export const essentialRecipes = {
  tooltip:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { Tooltip } from './components/Tooltip/Tooltip.jsx';\nimport { Button } from './components/Button/Button.jsx';\n\nexport default function App() {\n  return <Tooltip content=\"Keep this item for later.\"><Button variant=\"outline\">Save item</Button></Tooltip>;\n}\n",
  popover:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './components/Popover/Popover.jsx';\nimport { Button } from './components/Button/Button.jsx';\n\nexport default function App() {\n  return <Popover><PopoverTrigger><Button variant=\"outline\">Details</Button></PopoverTrigger><PopoverContent label=\"Collection details\"><p>Keep your work organized in one place.</p><PopoverClose><Button>Done</Button></PopoverClose></PopoverContent></Popover>;\n}\n",
  slider:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { RangeSlider } from './components/Slider/Slider.jsx';\n\nexport default function App() {\n  return <RangeSlider label=\"Price\" min={0} max={500} step={10} defaultValue={[80, 280]} formatValue={n => `€${n}`} />;\n}\n",
  calendar:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { Calendar } from './components/Calendar/Calendar.jsx';\n\nexport default function App() {\n  const [date, setDate] = useState();\n  return <Calendar mode=\"single\" selected={date} onSelect={setDate} />;\n}\n",
  'date-picker':
    "import React, { useState } from 'react';\nimport './base.css';\nimport { DatePicker } from './components/DatePicker/DatePicker.jsx';\n\nexport default function App() {\n  return <DatePicker label=\"Visit date\" name=\"visit\" />;\n}\n",
  table:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { DataTable } from './components/Table/Table.jsx';\n\nexport default function App() {\n  return <DataTable caption=\"Projects\" rows={[{id: 'studio', name: 'Studio website', budget: 4200}, {id: 'brand', name: 'Brand guidelines', budget: 1800}]} columns={[{key: 'name', header: 'Project'}, {key: 'budget', header: 'Budget'}]} />;\n}\n",
  pagination:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { Pagination } from './components/Pagination/Pagination.jsx';\n\nexport default function App() {\n  const [page, setPage] = useState(1);\n  return <><p>Page {page} of 12</p><Pagination page={page} pageCount={12} onPageChange={setPage} /></>;\n}\n",
  sheet:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from './components/Sheet/Sheet.jsx';\nimport { Button } from './components/Button/Button.jsx';\n\nexport default function App() {\n  return <Sheet><SheetTrigger><Button>Open filters</Button></SheetTrigger><SheetContent side=\"right\"><SheetTitle>Filters</SheetTitle><SheetDescription>Refine the results in this view.</SheetDescription><SheetClose><Button>Done</Button></SheetClose></SheetContent></Sheet>;\n}\n",
  'file-upload':
    "import React, { useState } from 'react';\nimport './base.css';\nimport { FileUpload } from './components/FileUpload/FileUpload.jsx';\n\nexport default function App() {\n  return <FileUpload label=\"Project attachments\" accept={{'application/pdf': ['.pdf'], 'image/png': ['.png']}} />;\n}\n",
  skeleton:
    'import React, { useState } from \'react\';\nimport \'./base.css\';\nimport { SkeletonCard } from \'./components/Skeleton/Skeleton.jsx\';\n\nexport default function App() {\n  return <div role="status" aria-label="Loading article" aria-busy="true"><SkeletonCard /></div>;\n}\n',
  alert:
    "import React, { useState } from 'react';\nimport './base.css';\nimport { Alert } from './components/Alert/Alert.jsx';\n\nexport default function App() {\n  return <Alert title=\"Your workspace is ready.\" tone=\"success\">Invite your team whenever you are ready.</Alert>;\n}\n",
};
