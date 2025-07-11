const Contact = () => {
  return (
    <div className="max-w-md mx-auto mt-4 p-6 space-y-4">
      <h1 className="text-2xl font-bold">Contact Me</h1>
      <p className="text-gray-600">
        I'm aNasiusA, the developer behind Fundly. Got a bug, idea, or just want
        to say hi? Reach out!
      </p>

      <div className="bg-gray-100 p-4 rounded">
        <p className="font-semibold">📧 Email:</p>
        <a
          href="mailto:kasserteea@gmail.com?subject=Feedback on Fundly"
          className="text-blue-600 underline"
        >
          kasserteea@gmail.com
        </a>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <p className="font-semibold">💻 GitHub:</p>
        <a
          href="https://github.com/aNasiusA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          github.com/aNasiusA
        </a>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <p className="font-semibold">💬 Twitter (X):</p>
        <a
          href="https://x.com/_anasiusa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          @_anasiusa
        </a>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <p className="font-semibold">💼 LinkedIn:</p>
        <a
          href="https://www.linkedin.com/in/anasiusa/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          linkedin.com/in/anasiusa
        </a>
      </div>
    </div>
  );
};

export default Contact;
