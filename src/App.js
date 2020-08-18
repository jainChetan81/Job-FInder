import React from "react";
import useFetchJobs from "./Hooks/useFetchJobs";
import { Container } from "react-bootstrap";
import Job from "./Component/Job";
import JobsPagination from "./Component/JobsPagination";

function App() {
    const [params, setParams] = React.useState({});
    const [page, setPage] = React.useState(1);
    var { loading, error, jobs, hasNextPage } = useFetchJobs(params, page);
    return (
        <Container className="my-4">
            <h1 className="mb-4">Github Jobs</h1>
            <JobsPagination
                page={page}
                setPage={setPage}
                hasNextPage={hasNextPage}
            />
            {loading && <h1>Loading...</h1>}
            {error && <h1>Error... Try Refreshing</h1>}
            {jobs.map((job) => (
                <Job key={job.id} job={job} />
            ))}
        </Container>
    );
}

export default App;
