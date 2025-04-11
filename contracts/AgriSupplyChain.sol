// //SPDX-License-Identifier: MIT

// pragma solidity ^0.8.0;

// // In AgriSupplyChain.sol
// import { IAgriSupplyChain } from "./IAgriSupplyChain.sol";
// import { ProductStructs } from "./ProductStructs.sol";

// contract AgriSupplyChain is IAgriSupplyChain {
//     using ProductStructs for ProductStructs.Product;

//     mapping(uint256 => ProductStructs.Product) public products;
//     uint256 public productCount;
//     mapping(address => string) public userRoles;

//     uint8 constant CREATED = 0;
//     uint8 constant COLLECTED = 1;
//     uint8 constant IN_TRANSIT = 2;
//     uint8 constant WITH_DISTRIBUTOR = 3;
//     uint8 constant WITH_RETAILER = 4;
//     uint8 constant SOLD = 5;

//     constructor() {
//         productCount = 0;
//         userRoles[msg.sender] = "ADMIN";
//     }

//     function registerUser(address _user, string memory _role) public override {
//         require(
//             keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("ADMIN")) ||
//             bytes(userRoles[_user]).length == 0,
//             "Unauthorized or user already registered"
//         );
//         userRoles[_user] = _role;
//     }

//     function createProduct(string memory _name, uint256 _basePrice) public {
//         require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
//         require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("FARMER")), "Only farmers can create products");

//         productCount++;

//         ProductStructs.ProductDetails memory details = ProductStructs.ProductDetails({
//             name: _name,
//             basePrice: _basePrice,
//             isValid: true,
//             isPaid: false
//         });

//         ProductStructs.ProductActors memory actors = ProductStructs.ProductActors({
//             farmer: msg.sender,
//             collector: address(0),
//             transporter: address(0),
//             distributor: address(0),
//             retailer: address(0),
//             consumer: address(0)
//         });

//         ProductStructs.ProductFees memory fees = ProductStructs.ProductFees({
//             collectorFee: 0,
//             transporterFee: 0,
//             distributorFee: 0,
//             retailerFee: 0
//         });

//         products[productCount] = ProductStructs.Product({
//             id: productCount,
//             details: details,
//             actors: actors,
//             fees: fees,
//             state: CREATED
//         });

//         emit ProductCreated(productCount, _name, _basePrice, msg.sender);
//     }

//     function collectProduct(uint256 _productId, uint256 _collectorFee) public payable {
//         require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
//         require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("COLLECTOR")), "Only collectors can collect products");
//         require(products[_productId].details.isValid, "Product does not exist");
//         require(products[_productId].state == CREATED, "Product not in correct state");
//         require(msg.value >= products[_productId].details.basePrice, "Insufficient payment for farmer");

//         payable(products[_productId].actors.farmer).transfer(products[_productId].details.basePrice);

//         products[_productId].actors.collector = msg.sender;
//         products[_productId].fees.collectorFee = _collectorFee;
//         products[_productId].state = COLLECTED;
//         products[_productId].details.isPaid = false;

//         emit PaymentProcessed(msg.sender, products[_productId].actors.farmer, products[_productId].details.basePrice);
//         emit FeeAdded(_productId, msg.sender, _collectorFee);
//         emit ProductStateChanged(_productId, COLLECTED);
//     }

//     function transportProduct(uint256 _productId, uint256 _transporterFee) public payable {
//         require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
//         require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("TRANSPORTER")), "Only transporters can transport products");
//         require(products[_productId].state == COLLECTED, "Product not in correct state");
//         require(msg.value >= products[_productId].fees.collectorFee, "Insufficient payment for collector");

//         payable(products[_productId].actors.collector).transfer(products[_productId].fees.collectorFee);

//         products[_productId].actors.transporter = msg.sender;
//         products[_productId].fees.transporterFee = _transporterFee;
//         products[_productId].state = IN_TRANSIT;
//         products[_productId].details.isPaid = false;

//         emit PaymentProcessed(msg.sender, products[_productId].actors.collector, products[_productId].fees.collectorFee);
//         emit FeeAdded(_productId, msg.sender, _transporterFee);
//         emit ProductStateChanged(_productId, IN_TRANSIT);
//     }

//     function distributeProduct(uint256 _productId, uint256 _distributorFee) public payable {
//         require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
//         require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("DISTRIBUTOR")), "Only distributors can receive products");
//         require(products[_productId].state == IN_TRANSIT, "Product not in correct state");
//         require(msg.value >= products[_productId].fees.transporterFee, "Insufficient payment for transporter");

//         payable(products[_productId].actors.transporter).transfer(products[_productId].fees.transporterFee);

//         products[_productId].actors.distributor = msg.sender;
//         products[_productId].fees.distributorFee = _distributorFee;
//         products[_productId].state = WITH_DISTRIBUTOR;
//         products[_productId].details.isPaid = false;

//         emit PaymentProcessed(msg.sender, products[_productId].actors.transporter, products[_productId].fees.transporterFee);
//         emit FeeAdded(_productId, msg.sender, _distributorFee);
//         emit ProductStateChanged(_productId, WITH_DISTRIBUTOR);
//     }

//     function sendToRetailer(uint256 _productId, uint256 _retailerFee) public payable {
//         require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
//         require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes("RETAILER")), "Only retailers can receive products");
//         require(products[_productId].state == WITH_DISTRIBUTOR, "Product not in correct state");
//         require(msg.value >= products[_productId].fees.distributorFee, "Insufficient payment for distributor");

//         payable(products[_productId].actors.distributor).transfer(products[_productId].fees.distributorFee);

//         products[_productId].actors.retailer = msg.sender;
//         products[_productId].fees.retailerFee = _retailerFee;
//         products[_productId].state = WITH_RETAILER;
//         products[_productId].details.isPaid = false;

//         emit PaymentProcessed(msg.sender, products[_productId].actors.distributor, products[_productId].fees.distributorFee);
//         emit FeeAdded(_productId, msg.sender, _retailerFee);
//         emit ProductStateChanged(_productId, WITH_RETAILER);
//     }

//     function purchaseProduct(uint256 _productId) public payable {
//         require(products[_productId].details.isValid, "Product does not exist");
//         require(products[_productId].state == WITH_RETAILER, "Product not available for purchase");
//         require(msg.value >= products[_productId].fees.retailerFee, "Insufficient payment for retailer");

//         payable(products[_productId].actors.retailer).transfer(products[_productId].fees.retailerFee);

//         products[_productId].actors.consumer = msg.sender;
//         products[_productId].state = SOLD;
//         products[_productId].details.isPaid = true;

//         emit PaymentProcessed(msg.sender, products[_productId].actors.retailer, products[_productId].fees.retailerFee);
//         emit ProductStateChanged(_productId, SOLD);
//     }

//     function getProductBasicInfo(uint256 _productId) public view override returns (
//         uint256 id,
//         string memory name,
//         uint256 basePrice,
//         uint8 state,
//         bool isValid
//     ) {
//         ProductStructs.Product storage product = products[_productId];
//         return (
//             product.id,
//             product.details.name,
//             product.details.basePrice,
//             product.state,
//             product.details.isValid
//         );
//     }

//     function getProductFees(uint256 _productId) public view override returns (
//         uint256 collectorFee,
//         uint256 transporterFee,
//         uint256 distributorFee,
//         uint256 retailerFee
//     ) {
//         ProductStructs.ProductFees storage fees = products[_productId].fees;
//         return (
//             fees.collectorFee,
//             fees.transporterFee,
//             fees.distributorFee,
//             fees.retailerFee
//         );
//     }

//     function getProductActors(uint256 _productId) public view override returns (
//         address farmer,
//         address collector,
//         address transporter,
//         address distributor,
//         address retailer,
//         address consumer
//     ) {
//         ProductStructs.ProductActors storage actors = products[_productId].actors;
//         return (
//             actors.farmer,
//             actors.collector,
//             actors.transporter,
//             actors.distributor,
//             actors.retailer,
//             actors.consumer
//         );
//     }

//     function getTotalPrice(uint256 _productId) public view returns (uint256) {
//         ProductStructs.Product storage product = products[_productId];
//         return product.details.basePrice +
//                product.fees.collectorFee +
//                product.fees.transporterFee +
//                product.fees.distributorFee +
//                product.fees.retailerFee;
//     }
// }


pragma solidity ^0.8.0;

// In AgriSupplyChain.sol
import {IAgriSupplyChain} from "./IAgriSupplyChain.sol";
import {ProductStructs} from "./ProductStructs.sol";

contract AgriSupplyChain is IAgriSupplyChain {
    using ProductStructs for ProductStructs.Product;

    mapping(uint256 => ProductStructs.Product) public products;
    uint256 public productCount;
    mapping(address => string) public userRoles;

    struct Payment {
        address from;
        address to;
        uint256 amount;
        uint8 fromState;
        uint8 toState;
        uint256 timestamp;
    }

    mapping(uint256 => Payment[]) public productPayments;

    address public constant ADMIN = 0xD428DDce2d9129f6cD6dea7D88ccf1b9881DC863
;

    uint8 constant CREATED = 0;
    uint8 constant COLLECTED = 1;
    uint8 constant IN_TRANSIT = 2;
    uint8 constant WITH_DISTRIBUTOR = 3;
    uint8 constant WITH_RETAILER = 4;
    uint8 constant SOLD = 5;

    event TransactionReverted(
        uint256 productId,
        uint8 fromState,
        uint8 toState,
        address by
    );

    modifier onlyAdmin() {
        require(msg.sender == ADMIN, "Only admin can perform this action");
        _;
    }

    constructor() {
        productCount = 0;
        userRoles[ADMIN] = "ADMIN";
    }

    function recordPayment(
        uint256 _productId,
        address _from,
        address _to,
        uint256 _amount,
        uint8 _fromState,
        uint8 _toState
    ) internal {
        Payment memory newPayment = Payment({
            from: _from,
            to: _to,
            amount: _amount,
            fromState: _fromState,
            toState: _toState,
            timestamp: block.timestamp
        });
        productPayments[_productId].push(newPayment);
    }

    // function revertTransaction(uint256 _productId) public onlyAdmin {
    //     ProductStructs.Product storage product = products[_productId];
    //     require(product.details.isValid, "Product does not exist");
    //     require(product.state != CREATED, "Cannot revert initial state");

    //     Payment[] storage payments = productPayments[_productId];
    //     require(payments.length > 0, "No payments to revert");

    //     // Get the last payment
    //     Payment storage lastPayment = payments[payments.length - 1];

    //     // Refund the payment
    //     payable(lastPayment.from).transfer(lastPayment.amount);

    //     // Revert the state
    //     product.state = lastPayment.fromState;

    //     // Reset the appropriate actor and fee based on the state
    //     if (product.state == CREATED) {
    //         product.actors.collector = address(0);
    //         product.fees.collectorFee = 0;
    //     } else if (product.state == COLLECTED) {
    //         product.actors.transporter = address(0);
    //         product.fees.transporterFee = 0;
    //     } else if (product.state == IN_TRANSIT) {
    //         product.actors.distributor = address(0);
    //         product.fees.distributorFee = 0;
    //     } else if (product.state == WITH_DISTRIBUTOR) {
    //         product.actors.retailer = address(0);
    //         product.fees.retailerFee = 0;
    //     } else if (product.state == WITH_RETAILER) {
    //         product.actors.consumer = address(0);
    //     }

    //     // Remove the last payment record
    //     payments.pop();

    //     emit TransactionReverted(
    //         _productId,
    //         lastPayment.toState,
    //         lastPayment.fromState,
    //         msg.sender
    //     );
    // }

    function revertTransaction(uint256 _productId) public onlyAdmin {
        ProductStructs.Product storage product = products[_productId];
        require(product.details.isValid, "Product does not exist");
        require(product.state != CREATED, "Cannot revert initial state");

        Payment[] storage payments = productPayments[_productId];
        require(payments.length > 0, "No payments to revert");

        // Get the last payment
        Payment storage lastPayment = payments[payments.length - 1];

        // Check contract balance
        require(
            address(this).balance >= lastPayment.amount,
            "Insufficient contract balance for refund"
        );

        // Check if state transition is valid
        require(
            lastPayment.toState == product.state,
            "Invalid state for reversion"
        );

        // Refund the payment
        (bool success, ) = payable(lastPayment.from).call{
            value: lastPayment.amount
        }("");
        require(success, "Refund transfer failed");

        // Revert the state
        product.state = lastPayment.fromState;

        // Reset the appropriate actor and fee based on the state
        if (product.state == CREATED) {
            product.actors.collector = address(0);
            product.fees.collectorFee = 0;
        } else if (product.state == COLLECTED) {
            product.actors.transporter = address(0);
            product.fees.transporterFee = 0;
        } else if (product.state == IN_TRANSIT) {
            product.actors.distributor = address(0);
            product.fees.distributorFee = 0;
        } else if (product.state == WITH_DISTRIBUTOR) {
            product.actors.retailer = address(0);
            product.fees.retailerFee = 0;
        } else if (product.state == WITH_RETAILER) {
            product.actors.consumer = address(0);
        }

        // Remove the last payment record
        payments.pop();

        emit TransactionReverted(
            _productId,
            lastPayment.toState,
            lastPayment.fromState,
            msg.sender
        );
    }

    function registerUser(address _user, string memory _role) public override {
        require(
            keccak256(bytes(userRoles[msg.sender])) ==
                keccak256(bytes("ADMIN")) ||
                bytes(userRoles[_user]).length == 0,
            "Unauthorized or user already registered"
        );
        userRoles[_user] = _role;
    }

    function createProduct(string memory _name, uint256 _basePrice) public {
        require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
        require(
            keccak256(bytes(userRoles[msg.sender])) ==
                keccak256(bytes("FARMER")),
            "Only farmers can create products"
        );

        productCount++;

        ProductStructs.ProductDetails memory details = ProductStructs
            .ProductDetails({
                name: _name,
                basePrice: _basePrice,
                isValid: true,
                isPaid: false,
                location: ProductStructs.Location({
                    district: "",
                    localBody: "",
                    distance: 0
                })
            });

        ProductStructs.ProductActors memory actors = ProductStructs
            .ProductActors({
                farmer: msg.sender,
                collector: address(0),
                transporter: address(0),
                distributor: address(0),
                retailer: address(0),
                consumer: address(0)
            });

        ProductStructs.ProductFees memory fees = ProductStructs.ProductFees({
            collectorFee: 0,
            transporterFee: 0,
            distributorFee: 0,
            retailerFee: 0
        });

        products[productCount] = ProductStructs.Product({
            id: productCount,
            details: details,
            actors: actors,
            fees: fees,
            state: CREATED
        });

        emit ProductCreated(productCount, _name, _basePrice, msg.sender);
    }

    function collectProduct(
        uint256 _productId,
        uint256 _collectorFee,
        string memory _district,
        string memory _localBody,
        uint256 _distance
    ) public payable {
        require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
        require(
            keccak256(bytes(userRoles[msg.sender])) ==
                keccak256(bytes("COLLECTOR")),
            "Only collectors can collect products"
        );
        require(products[_productId].details.isValid, "Product does not exist");
        require(
            products[_productId].state == CREATED,
            "Product not in correct state"
        );
        require(
            msg.value >= products[_productId].details.basePrice,
            "Insufficient payment for farmer"
        );

        payable(products[_productId].actors.farmer).transfer(
            products[_productId].details.basePrice
        );

        products[_productId].actors.collector = msg.sender;
        products[_productId].fees.collectorFee = _collectorFee;
        products[_productId].state = COLLECTED;
        products[_productId].details.isPaid = false;

        // Store the location and distance information
        products[_productId].details.location.district = _district;
        products[_productId].details.location.localBody = _localBody;
        products[_productId].details.location.distance = _distance;

        recordPayment(
            _productId,
            msg.sender,
            products[_productId].actors.farmer,
            msg.value,
            CREATED,
            COLLECTED
        );

        emit PaymentProcessed(
            msg.sender,
            products[_productId].actors.farmer,
            products[_productId].details.basePrice
        );
        emit FeeAdded(_productId, msg.sender, _collectorFee);
        emit ProductStateChanged(_productId, COLLECTED);
    }

    function transportProduct(
        uint256 _productId,
        uint256 _transporterFee
    ) public payable {
        require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
        require(
            keccak256(bytes(userRoles[msg.sender])) ==
                keccak256(bytes("TRANSPORTER")),
            "Only transporters can transport products"
        );
        require(
            products[_productId].state == COLLECTED,
            "Product not in correct state"
        );
        require(
            msg.value >= products[_productId].fees.collectorFee,
            "Insufficient payment for collector"
        );

        payable(products[_productId].actors.collector).transfer(
            products[_productId].fees.collectorFee
        );

        products[_productId].actors.transporter = msg.sender;
        products[_productId].fees.transporterFee = _transporterFee;
        products[_productId].state = IN_TRANSIT;
        products[_productId].details.isPaid = false;

        recordPayment(
            _productId,
            msg.sender,
            products[_productId].actors.collector,
            msg.value,
            COLLECTED,
            IN_TRANSIT
        );

        emit PaymentProcessed(
            msg.sender,
            products[_productId].actors.collector,
            products[_productId].fees.collectorFee
        );
        emit FeeAdded(_productId, msg.sender, _transporterFee);
        emit ProductStateChanged(_productId, IN_TRANSIT);
    }

    function distributeProduct(
        uint256 _productId,
        uint256 _distributorFee
    ) public payable {
        require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
        require(
            keccak256(bytes(userRoles[msg.sender])) ==
                keccak256(bytes("DISTRIBUTOR")),
            "Only distributors can receive products"
        );
        require(
            products[_productId].state == IN_TRANSIT,
            "Product not in correct state"
        );
        require(
            msg.value >= products[_productId].fees.transporterFee,
            "Insufficient payment for transporter"
        );

        payable(products[_productId].actors.transporter).transfer(
            products[_productId].fees.transporterFee
        );

        products[_productId].actors.distributor = msg.sender;
        products[_productId].fees.distributorFee = _distributorFee;
        products[_productId].state = WITH_DISTRIBUTOR;
        products[_productId].details.isPaid = false;

        recordPayment(
            _productId,
            msg.sender,
            products[_productId].actors.transporter,
            msg.value,
            IN_TRANSIT,
            WITH_DISTRIBUTOR
        );

        emit PaymentProcessed(
            msg.sender,
            products[_productId].actors.transporter,
            products[_productId].fees.transporterFee
        );
        emit FeeAdded(_productId, msg.sender, _distributorFee);
        emit ProductStateChanged(_productId, WITH_DISTRIBUTOR);
    }

    function sendToRetailer(
        uint256 _productId,
        uint256 _retailerFee
    ) public payable {
        require(bytes(userRoles[msg.sender]).length > 0, "User not registered");
        require(
            keccak256(bytes(userRoles[msg.sender])) ==
                keccak256(bytes("RETAILER")),
            "Only retailers can receive products"
        );
        require(
            products[_productId].state == WITH_DISTRIBUTOR,
            "Product not in correct state"
        );
        require(
            msg.value >= products[_productId].fees.distributorFee,
            "Insufficient payment for distributor"
        );

        payable(products[_productId].actors.distributor).transfer(
            products[_productId].fees.distributorFee
        );

        products[_productId].actors.retailer = msg.sender;
        products[_productId].fees.retailerFee = _retailerFee;
        products[_productId].state = WITH_RETAILER;
        products[_productId].details.isPaid = false;

        recordPayment(
            _productId,
            msg.sender,
            products[_productId].actors.distributor,
            msg.value,
            WITH_DISTRIBUTOR,
            WITH_RETAILER
        );

        emit PaymentProcessed(
            msg.sender,
            products[_productId].actors.distributor,
            products[_productId].fees.distributorFee
        );
        emit FeeAdded(_productId, msg.sender, _retailerFee);
        emit ProductStateChanged(_productId, WITH_RETAILER);
    }

    function purchaseProduct(uint256 _productId) public payable {
        require(products[_productId].details.isValid, "Product does not exist");
        require(
            products[_productId].state == WITH_RETAILER,
            "Product not available for purchase"
        );
        require(
            msg.value >= products[_productId].fees.retailerFee,
            "Insufficient payment for retailer"
        );

        payable(products[_productId].actors.retailer).transfer(
            products[_productId].fees.retailerFee
        );

        products[_productId].actors.consumer = msg.sender;
        products[_productId].state = SOLD;
        products[_productId].details.isPaid = true;

        recordPayment(
            _productId,
            msg.sender,
            products[_productId].actors.retailer,
            msg.value,
            WITH_RETAILER,
            SOLD
        );

        emit PaymentProcessed(
            msg.sender,
            products[_productId].actors.retailer,
            products[_productId].fees.retailerFee
        );
        emit ProductStateChanged(_productId, SOLD);
    }

    function getProductTransactions(
        uint256 _productId
    )
        public
        view
        onlyAdmin
        returns (
            address[] memory from,
            address[] memory to,
            uint256[] memory amounts,
            uint8[] memory fromStates,
            uint8[] memory toStates,
            uint256[] memory timestamps
        )
    {
        Payment[] storage payments = productPayments[_productId];
        uint256 length = payments.length;

        from = new address[](length);
        to = new address[](length);
        amounts = new uint256[](length);
        fromStates = new uint8[](length);
        toStates = new uint8[](length);
        timestamps = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            from[i] = payments[i].from;
            to[i] = payments[i].to;
            amounts[i] = payments[i].amount;
            fromStates[i] = payments[i].fromState;
            toStates[i] = payments[i].toState;
            timestamps[i] = payments[i].timestamp;
        }

        return (from, to, amounts, fromStates, toStates, timestamps);
    }

    function getProductBasicInfo(
        uint256 _productId
    )
        public
        view
        override
        returns (
            uint256 id,
            string memory name,
            uint256 basePrice,
            uint8 state,
            bool isValid,
            string memory district,
            string memory localBody,
            uint256 distance
        )
    {
        ProductStructs.Product storage product = products[_productId];
        return (
            product.id,
            product.details.name,
            product.details.basePrice,
            product.state,
            product.details.isValid,
            product.details.location.district,
            product.details.location.localBody,
            product.details.location.distance
        );
    }

    function getProductFees(
        uint256 _productId
    )
        public
        view
        override
        returns (
            uint256 collectorFee,
            uint256 transporterFee,
            uint256 distributorFee,
            uint256 retailerFee
        )
    {
        ProductStructs.ProductFees storage fees = products[_productId].fees;
        return (
            fees.collectorFee,
            fees.transporterFee,
            fees.distributorFee,
            fees.retailerFee
        );
    }

    function getProductActors(
        uint256 _productId
    )
        public
        view
        override
        returns (
            address farmer,
            address collector,
            address transporter,
            address distributor,
            address retailer,
            address consumer
        )
    {
        ProductStructs.ProductActors storage actors = products[_productId]
            .actors;
        return (
            actors.farmer,
            actors.collector,
            actors.transporter,
            actors.distributor,
            actors.retailer,
            actors.consumer
        );
    }

    function getTotalPrice(uint256 _productId) public view returns (uint256) {
        ProductStructs.Product storage product = products[_productId];
        return
            product.details.basePrice +
            product.fees.collectorFee +
            product.fees.transporterFee +
            product.fees.distributorFee +
            product.fees.retailerFee;
    }
}
