import Image from "next/image";

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tervetuloa testisivulle</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-4xl font-semibold mb-4">Tietoja meistä</h2>
        <p className="mb-4">
          Tämä on esimerkki staattisesta sisällöstä Next.js-sovelluksessa. Kaikki tämän sivun
          sisältö on kovakoodattu suoraan komponenttiin.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Esimerkkikuva</h2>
        <div className="relative h-64 w-full md:w-1/2 overflow-hidden rounded-lg">
          <Image
            src="/placeholder-img.png"
            alt="Esimerkkikuva"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Huomaa: varmista, että /public/images/example.jpg -tiedosto on olemassa, tai korvaa se
          toisella kuvalla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Ominaisuus 1</h3>
          <p>Tämä on kuvaus ensimmäisestä ominaisuudesta.</p>
        </div>
        <div className="bg-green-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Ominaisuus 2</h3>
          <p>Tämä on kuvaus toisesta ominaisuudesta.</p>
        </div>
        <div className="bg-yellow-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Ominaisuus 3</h3>
          <p>Tämä on kuvaus kolmannesta ominaisuudesta.</p>
        </div>
      </div>
    </div>
  );
}
