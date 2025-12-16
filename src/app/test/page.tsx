import Container from '@/components/Container';
import { Button } from '@/components/ui/button';

export default function TestPage() {
  return (
    <Container className="py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Button Test</h1>
      <div className='space-x-4'>
        <Button className='bg-brand-500 hover:bg-brand-600 text-white'>Primary</Button>
        <Button className='bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'>Secondary</Button>
        <Button className='hover:bg-accent hover:text-accent-foreground'>Ghost</Button>
      </div>
      <div className='space-x-4'>
        <Button className='h-8 rounded-md px-3 text-xs'>Small</Button>
        <Button className='h-9 px-4 py-2'>Medium</Button>
        <Button className='h-10 rounded-md px-8'>Large</Button>
      </div>
      <div>
        <Button disabled> Disabled</Button>
      </div>
    </Container>
  );
}

