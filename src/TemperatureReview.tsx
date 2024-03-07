import React, { useState, useEffect } from "react";
import jsonData from "./temperatures-daily.json";
import { ThemeProvider, Container,  Stack, Row, Col, Table, Form, Button } from "react-bootstrap";
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from "recharts";
import "./StyleExtension.css";

// Define the interface for the data type
interface Data {
    YYYYMMDD: number;
    "TM (℃)": number;
}

// Define the component that renders the data as table and graph
const TemperatureReview: React.FC = () => {
    // Use state to store the data
    const [data, setData] = useState<Data[]>(jsonData);

    // Use state to store the data for the graph separately
    const [graphData, setGraphData] = useState<Data[]>(jsonData);

    // Use state to store the search term and the sort order
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    // Sort both data and graphData
    useEffect(() => {
        const sortedData = getFilteredAndSortedData();
        setData(sortedData);
        setGraphData([...sortedData].reverse()); // Reverse the sortedData for the better graph understanding
    }, [sortOrder]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSortClick = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Define a function to filter and sort the data by the search term and sort order
    const getFilteredAndSortedData = () => {
        let filteredData = data;
        if (searchTerm) {
            const searchNumber = Number(searchTerm);
            if (!isNaN(searchNumber)) {
                filteredData = filteredData.filter(
                    (item) => item.YYYYMMDD === searchNumber || item["TM (℃)"] === searchNumber
                );
            }
        }

        return filteredData.sort((a, b) =>
            sortOrder === "asc"
                ? b.YYYYMMDD - a.YYYYMMDD
                : a.YYYYMMDD - b.YYYYMMDD
        );
    };

    // Display the data as table and graph
    return (
        <ThemeProvider
            breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
            minBreakpoint="xxs"
        >
            <Container>
                <h1 className="text-center">Review of historical daily temperature values for the city of Magdeburg</h1>
                <div>
                    <Row>
                        <Col>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Search by exact date or temperature, filter by exact temperature</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                            </Form>
                            <Table striped bordered hover size="sm">
                                <thead className="align-middle">
                                <tr>
                                    <th>
                                        <Stack direction="horizontal" gap={2}>
                                            Date (YYYYMMDD)
                                            <Button variant="outline-secondary" size="sm" onClick={handleSortClick}>
                                                {sortOrder === "asc" ? "▲" : "▼"}
                                            </Button>
                                        </Stack>
                                    </th>
                                    <th>Temperature (℃)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getFilteredAndSortedData().map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.YYYYMMDD}</td>
                                        <td>{item["TM (℃)"]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <div className="graph-container">
                                <LineChart width={600} height={300} data={graphData}>
                                    <XAxis dataKey="YYYYMMDD" label={{ value: "Date", position: "bottom"}}/>
                                    <YAxis dataKey="TM (℃)" label={{ value: "Temperature", angle: -90}}/>
                                    <CartesianGrid stroke="#eee"/>
                                    <Line type="monotone" dataKey="TM (℃)" stroke="#8884d8"/>
                                    <Tooltip/>
                                </LineChart>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </ThemeProvider>
    );
};

export default TemperatureReview;
