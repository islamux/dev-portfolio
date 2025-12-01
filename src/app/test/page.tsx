import Container from '@/components/Container';
import Button from '@/components/ui/Button';

export default function TestPage() {
  return (
    <Container className="py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Button Test</h1>
      <div className='space-x-4'>
        <Button variant='primary'>Srimary</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='ghost'>Ghost</Button>
      </div>
      <div className='space-x-4'>
        <Button size='sm'>Small</Button>
        <Button size='md'>Medium</Button>
        <Button size='lg'>Large</Button>
      </div>
      <div>
        <Button disabled> Disabled</Button>
      </div>
    </Container>
  );
}

