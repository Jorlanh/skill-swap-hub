const CoursesPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-foreground mb-6">Meus Cursos</h1>
      <div className="bg-skillswap-card-bg rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Você ainda não está inscrito em nenhum curso.</p>
        <p className="text-sm text-muted-foreground mt-2">Explore as comunidades para encontrar oportunidades de aprendizado!</p>
      </div>
    </div>
  );
};

export default CoursesPage;
