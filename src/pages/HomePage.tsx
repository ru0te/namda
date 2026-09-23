import { useState } from "react";

import Form from "../components/Form";
import Hero from "../components/Hero";

function HomePage() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Hero onReady={() => setHeroReady(true)} />
      {heroReady && <Form />}
    </>
  );
}

export default HomePage;
