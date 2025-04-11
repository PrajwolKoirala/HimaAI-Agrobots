// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAgriSupplyChain {
    event ProductCreated(uint256 productId, string name, uint256 price, address farmer);
    event ProductStateChanged(uint256 productId, uint8 newState);
    event PaymentProcessed(address from, address to, uint256 amount);
    event FeeAdded(uint256 productId, address entity, uint256 fee);
    
    function registerUser(address _user, string memory _role) external;
    
    // Split get functions to avoid stack too deep
function getProductBasicInfo(uint256 _productId) external view returns (
    uint256 id,
    string memory name,
    uint256 basePrice,
    uint8 state,
    bool isValid,
    string memory district,
    string memory localBody,
    uint256 distance
); 
    function getProductFees(uint256 _productId) external view returns (
        uint256 collectorFee,
        uint256 transporterFee,
        uint256 distributorFee,
        uint256 retailerFee
    );
    
    function getProductActors(uint256 _productId) external view returns (
        address farmer,
        address collector,
        address transporter,
        address distributor,
        address retailer,
        address consumer
    );
}