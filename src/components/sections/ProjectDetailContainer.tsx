import Container from "../Container";

interface ProjectDetailContainerProps {
  children: React.ReactNode;
}

export function ProjectDetailContainer({ children }: ProjectDetailContainerProps) {

  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </Container>
    </div>
  );
}
