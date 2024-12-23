import React, { useState, useEffect } from "react";
import { useAdminStore } from "../../store/admin";
import { motion } from "framer-motion";
import { useBarangays } from "../../store/barangays";
import { GiCoconuts } from "react-icons/gi";
import { FaUsers, FaWeight, FaCrown, FaPlus } from "react-icons/fa";
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    ListGroup,
    Button,
    Modal,
    Form,
} from "react-bootstrap";
import build from "../../utils/dev";
import { useMarketUpdates } from "../../store/market";
import { toast, Toaster } from "sonner";

const Market = () => {
    const admin = useAdminStore((state) => state.admin);

    return (
        <Container style={styles.fullWidth}>
            <div style={styles.container}>
                <h1 className="text-center mb-4">Trade & Market</h1>
                {admin.role === "admin" ? (
                    <AdminDashboard />
                ) : (
                    <UserMarketView />
                )}
            </div>
        </Container>
    );
};

const AdminDashboard = () => {
    const { updates, fetchMarketUpdates } = useMarketUpdates();

    const { barangays } = useBarangays((state) => state);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [prices, setPrices] = useState([{ kg: "", price: "" }]);
    const handlePriceChange = (index, field, value) => {
        const updatedPrices = [...prices];
        updatedPrices[index][field] = value;
        setPrices(updatedPrices);
    };
    const handleAddPrice = () => setPrices([...prices, { kg: "", price: "" }]);
    const handleRemovePrice = (index) => {
        const updatedPrices = prices.filter((_, i) => i !== index);
        setPrices(updatedPrices);
    };

    // For Barangay volume modal
    const [barangayVolumes, setBarangayVolumes] = useState(
        barangays.map((barangay) => ({
            barangay: barangay.barangay_name,
            volume: "",
        }))
    );

    const handleBarangayChange = (index, field, value) => {
        const updatedVolumes = [...barangayVolumes];
        updatedVolumes[index][field] = value;
        setBarangayVolumes(updatedVolumes);
    };

    const [topMarket, setTopMarket] = useState({ name: "", description: "" });
    const handleTopMarketChange = (field, value) => {
        setTopMarket({ ...topMarket, [field]: value });
    };

    const handleAddMarketUpdate = async () => {
        const isPricesEmpty = prices.some(
            (price) => price.kg === "" || price.price === ""
        );
        const isBarangayVolumesEmpty = barangayVolumes.some(
            (volume) => volume.barangay === "" || volume.volume === ""
        );
        const isTopMarketEmpty =
            topMarket.name === "" || topMarket.description === "";

        if (isPricesEmpty || isBarangayVolumesEmpty || isTopMarketEmpty) {
            toast.error(
                "Please provide all the data for Price per coconut kg, Volume of coconut per barangay, and Top Market."
            );
            return;
        }

        try {
            const processedPrices = JSON.stringify(prices);
            const processedBarangayVolumes = JSON.stringify(barangayVolumes);
            const processedTopMarket = JSON.stringify(topMarket);

            const response = await fetch(build("market/add"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    price_per_coconut_kg: processedPrices,
                    volume_of_coconut: processedBarangayVolumes,
                    top_market: processedTopMarket,
                }),
            });
            if (!response.ok) {
                console.error("An error occurred. Please try again.");
                return;
            }
            toast.success("Market updated successfully.");
            setPrices([]);
            setBarangayVolumes(
                barangays.map((barangay) => ({
                    barangay: barangay.barangay_name,
                    volume: "",
                }))
            );
            setTopMarket({ name: "", description: "" });
            setShowUpdateModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    console.log(updates);

    const grandTotal = updates?.reduce((grandAcc, update) => {
        return (
            grandAcc +
            update.volume_of_coconut.reduce(
                (acc, volume) => acc + Number(volume.volume),
                0
            )
        );
    }, 0);

    const totalCoconutTreesPlanted = barangays.reduce(
        (acc, barangay) => acc + barangay.coconut_trees_planted,
        0
    );

    useEffect(() => {
        fetchMarketUpdates();
    }, [fetchMarketUpdates]);

    return (
        <Container fluid className="p-0" styles={styles.page}>
            <Toaster richColors position="top-center" />
            <Row>
                <Col md={2} className="bg-white vh-100 shadow-lg p-3">
                    <h4 className="text-success mb-4">
                        MAO Coconut Information Systems
                    </h4>

                    <ul className="list-unstyled">
                        <button
                            className="btn btn-primary text-white py-2 text-success fw-bold"
                            onClick={() => setShowUpdateModal(true)}
                        >
                            Update Market
                        </button>
                    </ul>
                </Col>

                {/* Main Dashboard */}
                <Col md={10} className="p-4">
                    <h3 className="mb-4 fw-bold">Set Trade & Market</h3>
                    <Row className="g-4">
                        {/* Cards */}
                        <Col md={3}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card className="shadow-lg p-4 d-flex flex-column align-items-center border-0 bg-white rounded-3 h-100">
                                    <FaUsers
                                        size={30}
                                        className="text-success"
                                    />
                                    <h5 className="mt-3 fw-bold">
                                        Total Farmers
                                    </h5>
                                    <p className="text-success fw-bold fs-4">
                                        {barangays.reduce((acc, barangay) => {
                                            return acc + barangay.farmers_count;
                                        }, 0)}
                                    </p>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card className="shadow-lg p-4 d-flex flex-column align-items-center border-0 bg-white rounded-3 h-100">
                                    <GiCoconuts
                                        size={30}
                                        className="text-success"
                                    />
                                    <h5 className="mt-3 fw-bold">
                                        Total Volume
                                    </h5>
                                    <p className="text-success fw-bold fs-4">
                                        {grandTotal}
                                    </p>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card className="shadow-lg p-4 d-flex flex-column align-items-center border-0 bg-white rounded-3 h-100">
                                    <GiCoconuts
                                        size={30}
                                        className="text-success"
                                    />
                                    <h5 className="mt-3 fw-bold">
                                        Total Planted
                                    </h5>
                                    <p className="text-success fw-bold fs-4">
                                        {totalCoconutTreesPlanted}
                                    </p>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card className="p-3 shadow-lg border-1 text-center">
                                    <FaCrown
                                        size={50}
                                        className="text-warning mb-3"
                                    />
                                    <h5 className="fw-bold">
                                        Top in the Market
                                    </h5>
                                    <p className="fs-4 fw-bold text-warning">
                                        {updates[0]?.top_market?.name}
                                    </p>
                                    <p className="fs-5 fw-thin text-muted">
                                        {updates[0]?.top_market?.description}
                                    </p>
                                    <small className="text-muted">
                                        Leading Supplier
                                    </small>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>

                    {/* Orders Overview */}
                    <Row className="mt-5">
                        <Col md={6}>
                            <Card
                                style={{
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                }}
                                className="shadow-lg border-1 bg-white"
                            >
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">
                                        Volume of Coconut Per Barangay
                                    </h5>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th className="text-success fw-bold fs-5">
                                                    Barangay
                                                </th>
                                                <th>Volume (kg)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="justify-items-center">
                                            {updates?.map(
                                                (update, updateIdx) => (
                                                    <>
                                                        <p className="text-muted mt-2">
                                                            as of{" "}
                                                            {new Date(
                                                                update.created_at
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "2-digit",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                        {update?.volume_of_coconut.map(
                                                            (volume, idx) => (
                                                                <tr
                                                                    key={`${updateIdx}-${idx}`}
                                                                >
                                                                    <td className="text-muted">
                                                                        {
                                                                            volume.barangay
                                                                        }{" "}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            volume.volume
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </>
                                                )
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Projects */}
                        <Col md={6}>
                            <Card
                                style={{
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                }}
                                className="shadow-lg border-1 bg-white"
                            >
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">
                                        Updated Price
                                    </h5>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Coconut per kilo (kg)</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {updates.map(
                                                (update, updateIdx) => (
                                                    <>
                                                        <p className="text-muted">
                                                            as of{" "}
                                                            {new Date(
                                                                update.created_at
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "2-digit",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                        {update.price_per_coconut_kg.map(
                                                            (price, idx) => (
                                                                <tr
                                                                    key={`${updateIdx}-${idx}`}
                                                                >
                                                                    <td className="text-muted">
                                                                        {
                                                                            price.kg
                                                                        }{" "}
                                                                        kg
                                                                    </td>
                                                                    <td>
                                                                        ₱{" "}
                                                                        {
                                                                            price.price
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </>
                                                )
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Single Update Modal */}
            <Modal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                centered
                size="lg" // Make modal large
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Market Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Price per Coconut Input */}
                    <h5 className="fw-bold">Price per Coconut (kg)</h5>
                    <Row className="mb-3">
                        {prices.map((price, index) => (
                            <React.Fragment key={index}>
                                {/* Coconut kg Input */}
                                <Col md={5}>
                                    <Form.Group controlId={`kg-${index}`}>
                                        <Form.Label>Coconut kg</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={price.kg}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    index,
                                                    "kg",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter kg"
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Price (₱) Input */}
                                <Col md={5}>
                                    <Form.Group controlId={`price-${index}`}>
                                        <Form.Label>Price (₱)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={price.price}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    index,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter price"
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Remove Button */}
                                {index > 0 && (
                                    <Col
                                        md={2}
                                        className="d-flex align-items-end"
                                    >
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleRemovePrice(index)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                )}
                            </React.Fragment>
                        ))}
                    </Row>
                    <Button variant="primary" onClick={handleAddPrice}>
                        <FaPlus /> Add More Prices
                    </Button>

                    {/* Volume of Coconut Input */}
                    <h5 className="fw-bold mt-4">
                        Volume of Coconut per Barangay
                    </h5>
                    <Row className="mb-3">
                        {barangayVolumes.map((volume, index) => (
                            <React.Fragment key={index}>
                                {/* Barangay Name - Left side */}
                                <Col md={6}>
                                    <Form.Group controlId={`barangay-${index}`}>
                                        <Form.Label>
                                            Barangay {index + 1}
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={volume.barangay}
                                            onChange={(e) =>
                                                handleBarangayChange(
                                                    index,
                                                    "barangay",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Barangay Name"
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Volume Input - Right side */}
                                <Col md={6}>
                                    <Form.Group controlId={`volume-${index}`}>
                                        <Form.Label>Volume (kg)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={volume.volume}
                                            onChange={(e) =>
                                                handleBarangayChange(
                                                    index,
                                                    "volume",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Volume"
                                        />
                                    </Form.Group>
                                </Col>
                            </React.Fragment>
                        ))}
                    </Row>

                    {/* Top Market Input */}
                    <h5 className="fw-bold mt-4">Top Market</h5>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="topMarketName">
                                <Form.Label>Market Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={topMarket.name}
                                    onChange={(e) =>
                                        handleTopMarketChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Market Name"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="topMarketDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={topMarket.description}
                                    onChange={(e) =>
                                        handleTopMarketChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Description"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowUpdateModal(false)}
                    >
                        Close
                    </Button>
                    <Button onClick={handleAddMarketUpdate} variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

const UserMarketView = () => {
    const { updates, fetchMarketUpdates } = useMarketUpdates();

    console.log(updates);

    useEffect(() => {
        fetchMarketUpdates();
    }, [fetchMarketUpdates]);
    return (
        <Container fluid className="p-4" style={styles.page}>
            <Row>
                {/* Sidebar */}
                <Col md={2} className="bg-white shadow-lg p-3 rounded">
                    <h5 className="fw-bold mb-4 text-success">
                        Market Overview
                    </h5>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="text-success fw-bold">
                            Price Updates
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                {/* Feed Section */}
                <Col md={6}>
                    <h5 className="fw-bold mb-3">Price of Coconut (per kg)</h5>
                    <div
                        style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            overflowX: "hidden",
                            padding: "10px",
                        }}
                    >
                        <Row className="g-2">
                            {updates[0]?.price_per_coconut_kg?.map(
                                (price, idx) => (
                                    <Col key={idx} xs={12} sm={6} md={3} lg={3}>
                                        <Card className="p-3 shadow-lg border-1">
                                            <div className="text-center">
                                                <Row className="align-items-center">
                                                    <FaWeight
                                                        size={50}
                                                        className="text-success mb-2"
                                                    />
                                                    <h6>{price.kg} kg</h6>
                                                </Row>
                                                <p className="fs-4 fw-bold text-success">
                                                    ₱{price.price}.00
                                                </p>
                                                <small className="text-muted">
                                                    Updated: June 2024
                                                </small>
                                            </div>
                                        </Card>
                                    </Col>
                                )
                            )}
                        </Row>
                    </div>

                    <Card className="p-3 mb-4 shadow-lg border-1">
                        <h5 className="fw-bold mb-3">
                            Latest volume of Coconut (per Barangay) as of{" "}
                            {new Date(
                                updates[0]?.created_at
                            ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </h5>
                        <ListGroup>
                            {updates[0]?.volume_of_coconut?.map(
                                (update, idx) => (
                                    <ListGroup.Item
                                        key={idx}
                                        className="d-flex justify-content-between"
                                    >
                                        {update.barangay}{" "}
                                        <span className="fw-bold">
                                            {update.volume} kg
                                        </span>
                                    </ListGroup.Item>
                                )
                            )}
                        </ListGroup>
                    </Card>
                </Col>

                {/* Top in the Market */}
                <Col md={3}>
                    <Card className="p-3 shadow-lg border-1 text-center">
                        <FaCrown size={50} className="text-warning mb-3" />
                        <h5 className="fw-bold">Top in the Market</h5>
                        <p className="fs-4 fw-bold text-warning">
                            {updates[0]?.top_market?.name}
                        </p>
                        <p className="fs-5 fw-thin text-muted">
                            {updates[0]?.top_market?.description}
                        </p>
                        <small className="text-muted">Leading Supplier</small>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

const styles = {
    page: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
};

export default Market;
