import {
  useEffect,
  useState,
} from "react";

import {
  askQuestion,
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "./api";


export default function App() {

  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    sources,
    setSources,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  async function refreshDocuments() {

    const data =
        await getDocuments();

    setDocuments(data);
  }


  useEffect(() => {

    refreshDocuments()
        .catch(error => {
          setError(
              error.message
          );
        });

  }, []);


  async function handleUpload(event) {

    event.preventDefault();

    if (!selectedFile) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      await uploadDocument(
          selectedFile
      );

      setSelectedFile(null);

      await refreshDocuments();

    } catch (error) {

      setError(
          error.message
      );

    } finally {

      setLoading(false);
    }
  }


  async function handleDelete(filename) {

    setLoading(true);
    setError("");

    try {

      await deleteDocument(
          filename
      );

      await refreshDocuments();

    } catch (error) {

      setError(
          error.message
      );

    } finally {

      setLoading(false);
    }
  }


  async function handleAsk(event) {

    event.preventDefault();

    const value =
        question.trim();

    if (!value) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const result =
          await askQuestion(
              value
          );

      setAnswer(
          result.answer
      );

      setSources(
          result.sources
      );

    } catch (error) {

      setError(
          error.message
      );

    } finally {

      setLoading(false);
    }
  }


  return (
      <main className="container">

        <h1>
          BluePeak Knowledge Assistant
        </h1>


        <section>

          <h2>
            Knowledge Base
          </h2>

          <form
              onSubmit={handleUpload}
          >

            <input
                type="file"
                accept=".md,.txt"

                onChange={event => {
                  setSelectedFile(
                      event
                          .target
                          .files[0]
                      ?? null
                  );
                }}
            />

            <button
                disabled={
                    loading
                    || !selectedFile
                }
            >
              Upload
            </button>

          </form>


          <ul>

            {documents.map(
                document => (

                    <li
                        key={
                          document.name
                        }
                    >

                                <span>
                                    {document.name}
                                </span>

                      <button
                          disabled={
                            loading
                          }

                          onClick={() =>
                              handleDelete(
                                  document.name
                              )
                          }
                      >
                        Delete
                      </button>

                    </li>
                )
            )}

          </ul>

        </section>


        <section>

          <h2>
            Ask a Question
          </h2>

          <form
              onSubmit={handleAsk}
          >

                    <textarea
                        value={question}

                        onChange={event =>
                            setQuestion(
                                event.target.value
                            )
                        }

                        rows="4"

                        placeholder={
                          "Ask about company policies..."
                        }
                    />

            <button
                disabled={loading}
            >
              Ask
            </button>

          </form>

        </section>


        {loading && (
            <p>
              Processing...
            </p>
        )}


        {error && (
            <p className="error">
              {error}
            </p>
        )}


        {answer && (

            <section>

              <h2>
                Answer
              </h2>

              <p>
                {answer}
              </p>


              <h3>
                Sources
              </h3>

              <ul>

                {sources.map(
                    (
                        source,
                        index
                    ) => (

                        <li key={index}>

                          {
                            source.source
                          }

                          {
                              source.start_index
                              !== null
                              &&
                              ` — position ${source.start_index}`
                          }

                        </li>
                    )
                )}

              </ul>

            </section>
        )}

      </main>
  );
}