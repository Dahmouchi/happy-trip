import HeroSub from "../../_components/hero-sub";

const International = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/international", text: "International" },
  ];

  return (
    <div>
      <HeroSub
        title="Les voyages internationaux"
        description="Partez à la découverte du monde avec nos voyages internationaux. Explorez des cultures fascinantes, des paysages exotiques et des destinations inoubliables aux quatre coins du globe."
        breadcrumbLinks={breadcrumbLinks}
      />
    </div>
  );
};

export default International;
