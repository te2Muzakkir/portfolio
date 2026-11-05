const sections = [
  'navbar',
  'hero',
  'projects',
  'skills',
  'timeline',
  'contact'
];

export async function loadSections() {
  await Promise.all(
    sections.map(async (name) => {
      const response = await fetch(`./sections/${name}.html`);

      if (!response.ok) {
        throw new Error(
          `Could not load sections/${name}.html: ${response.status}`
        );
      }

      const html = await response.text();
      const mount = document.getElementById(`${name}-mount`);

      if (!mount) {
        throw new Error(`Missing mount element: #${name}-mount`);
      }

      mount.innerHTML = html;
    })
  );
}