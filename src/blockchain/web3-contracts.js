// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title FootballChessPlayerCard
 * @dev Contract for Football Chess Player Card NFTs
 */
contract FootballChessPlayerCard is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private _tokenIdCounter;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Card attributes
    struct PlayerCardAttributes {
        string position;      // e.g. "Goalkeeper", "Striker"
        uint8 rating;         // 1-100 player rating
        uint8 number;         // Player number
        string movementType;  // Movement pattern (e.g. "Knight", "Bishop")
        uint8 speed;          // Player speed
        uint8 passing;        // Passing ability
        uint8 shooting;       // Shooting ability
        uint8 defending;      // Defending ability
        uint8 durability;     // Injury resistance
        uint16 experience;    // Experience points
        uint32 createdAt;     // Timestamp of creation
        bool legendary;       // If the card is legendary
        uint16 matchesPlayed; // Number of matches played
    }
    
    // Card attributes mapping
    mapping(uint256 => PlayerCardAttributes) public playerCards;
    
    // Events
    event PlayerCardCreated(uint256 indexed tokenId, address indexed owner);
    event PlayerCardUpdated(uint256 indexed tokenId, string attribute);
    
    // Team ID to player tokens mapping
    mapping(uint256 => uint256[]) public teamPlayers;
    
    // Player token to team ID mapping
    mapping(uint256 => uint256) public playerTeam;
    
    // Reward token address
    IERC20 public rewardToken;
    
    constructor(string memory name, string memory symbol, string memory baseURI, address rewardTokenAddress) 
        ERC721(name, symbol) {
        _baseTokenURI = baseURI;
        rewardToken = IERC20(rewardTokenAddress);
    }
    
    /**
     * @dev Set the base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Base URI for computing {tokenURI}
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Create a new player card NFT
     * @param to Recipient address
     * @param position Player position
     * @param rating Player rating
     * @param number Player number
     * @param movementType Player movement type
     * @param speed Player speed
     * @param passing Player passing ability
     * @param shooting Player shooting ability
     * @param defending Player defending ability
     * @param durability Player injury resistance
     * @param legendary Whether card is legendary
     * @return tokenId The newly minted token ID
     */
    function createPlayerCard(
        address to,
        string memory position,
        uint8 rating,
        uint8 number,
        string memory movementType,
        uint8 speed,
        uint8 passing,
        uint8 shooting,
        uint8 defending,
        uint8 durability,
        bool legendary
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        PlayerCardAttributes memory attributes = PlayerCardAttributes(
            position,
            rating,
            number,
            movementType,
            speed,
            passing,
            shooting,
            defending,
            durability,
            0, // initial experience
            uint32(block.timestamp),
            legendary,
            0 // initial matches played
        );
        
        playerCards[tokenId] = attributes;
        
        // Set token URI with metadata
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
        
        emit PlayerCardCreated(tokenId, to);
        
        return tokenId;
    }
    
    /**
     * @dev Generate token URI for metadata (in this case just using tokenId)
     * @param tokenId Token ID to generate URI for
     */
    function _generateTokenURI(uint256 tokenId) internal pure returns (string memory) {
        return tokenId.toString();
    }
    
    /**
     * @dev Add experience to a player card
     * @param tokenId Player card token ID
     * @param experiencePoints Experience points to add
     */
    function addExperience(uint256 tokenId, uint16 experiencePoints) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner or approved");
        
        PlayerCardAttributes storage card = playerCards[tokenId];
        card.experience += experiencePoints;
        
        // If experience reaches thresholds, improve attributes
        if (card.experience >= 1000 && card.rating < 100) {
            card.rating += 1;
        }
        
        emit PlayerCardUpdated(tokenId, "experience");
    }
    
    /**
     * @dev Record a match played with this card
     * @param tokenId Player card token ID
     */
    function recordMatch(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner or approved");
        
        PlayerCardAttributes storage card = playerCards[tokenId];
        card.matchesPlayed += 1;
        
        emit PlayerCardUpdated(tokenId, "matchesPlayed");
    }
    
    /**
     * @dev Add player to a team
     * @param teamId Team ID
     * @param tokenId Player card token ID
     */
    function addPlayerToTeam(uint256 teamId, uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner or approved");
        require(playerTeam[tokenId] == 0, "Player already on a team");
        
        teamPlayers[teamId].push(tokenId);
        playerTeam[tokenId] = teamId;
    }
    
    /**
     * @dev Remove player from a team
     * @param tokenId Player card token ID
     */
    function removePlayerFromTeam(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner or approved");
        
        uint256 teamId = playerTeam[tokenId];
        require(teamId != 0, "Player not on a team");
        
        // Find and remove player from team array
        uint256[] storage players = teamPlayers[teamId];
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == tokenId) {
                // Move the last element to this position and pop the last element
                players[i] = players[players.length - 1];
                players.pop();
                break;
            }
        }
        
        // Clear player team mapping
        playerTeam[tokenId] = 0;
    }
    
    /**
     * @dev Get all players in a team
     * @param teamId Team ID
     * @return Array of player token IDs
     */
    function getTeamPlayers(uint256 teamId) external view returns (uint256[] memory) {
        return teamPlayers[teamId];
    }
    
    /**
     * @dev Apply an injury to a player card
     * @param tokenId Player card token ID
     * @param injurySeverity Severity of injury (1-3: minor, serious, season-ending)
     * @return recovery Estimated recovery time in game units
     */
    function applyInjury(uint256 tokenId, uint8 injurySeverity) external returns (uint16 recovery) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner or approved");
        require(injurySeverity >= 1 && injurySeverity <= 3, "Invalid injury severity");
        
        PlayerCardAttributes storage card = playerCards[tokenId];
        
        // Calculate recovery time based on injury severity and player durability
        uint16 baseRecovery;
        if (injurySeverity == 1) {
            baseRecovery = 1; // Minor injury - minutes or one match
        } else if (injurySeverity == 2) {
            baseRecovery = 3; // Serious injury - multiple matches
        } else {
            baseRecovery = 10; // Season-ending
        }
        
        // Durability reduces recovery time (higher durability = faster recovery)
        recovery = baseRecovery * 100 / (card.durability + 10);
        
        emit PlayerCardUpdated(tokenId, "injury");
        
        return recovery;
    }
    
    /**
     * @dev Award tokens to a player card owner
     * @param tokenId Player card token ID
     * @param amount Amount of reward tokens
     */
    function awardTokens(uint256 tokenId, uint256 amount) external onlyOwner {
        address owner = ownerOf(tokenId);
        require(rewardToken.transfer(owner, amount), "Token transfer failed");
    }
    
    // Required overrides for ERC721URIStorage + ERC721Enumerable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // If token is being transferred and is part of a team, remove from team
        if (from != address(0) && playerTeam[tokenId] != 0) {
            uint256 teamId = playerTeam[tokenId];
            
            uint256[] storage players = teamPlayers[teamId];
            for (uint i = 0; i < players.length; i++) {
                if (players[i] == tokenId) {
                    players[i] = players[players.length - 1];
                    players.pop();
                    break;
                }
            }
            
            playerTeam[tokenId] = 0;
        }
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

/**
 * @title FootballChessRewardToken
 * @dev ERC20 Token for Football Chess game rewards
 */
contract FootballChessRewardToken is IERC20, Ownable {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;
    
    // KYC status for addresses
    mapping(address => bool) public isKycVerified;
    
    // Age restrictions
    mapping(address => bool) public isUnderage;
    mapping(address => uint256) public underageLocked;
    mapping(address => uint256) public underageUnlockTime;
    
    address public gameContract;
    
    // Events
    event KycStatusChanged(address indexed account, bool verified);
    event UnderageStatusChanged(address indexed account, bool underage);
    event RewardsLocked(address indexed account, uint256 amount);
    event RewardsUnlocked(address indexed account, uint256 amount);
    
    modifier onlyGameContract() {
        require(_msgSender() == gameContract || _msgSender() == owner(), "Caller is not game contract");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        
        // Mint initial supply to owner
        _mint(msg.sender, 100000000 * 10**18); // 100 million tokens
    }
    
    /**
     * @dev Set the address of the game contract
     */
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }
    
    /**
     * @dev Set KYC status for account
     */
    function setKycStatus(address account, bool verified) external onlyOwner {
        isKycVerified[account] = verified;
        emit KycStatusChanged(account, verified);
        
        // If underage user becomes verified (turns 18), unlock their tokens
        if (verified && isUnderage[account]) {
            _unlockUnderageTokens(account);
            isUnderage[account] = false;
            emit UnderageStatusChanged(account, false);
        }
    }
    
    /**
     * @dev Set underage status for account
     */
    function setUnderageStatus(address account, bool underage, uint256 unlockTimestamp) external onlyOwner {
        isUnderage[account] = underage;
        if (underage) {
            underageUnlockTime[account] = unlockTimestamp;
        }
        emit UnderageStatusChanged(account, underage);
    }
    
    /**
     * @dev Award tokens to an account, handling KYC and age restrictions
     */
    function awardTokens(address to, uint256 amount) external onlyGameContract returns (bool) {
        if (isUnderage[to] && !isKycVerified[to]) {
            // Lock tokens for underage users
            underageLocked[to] += amount;
            emit RewardsLocked(to, amount);
            return true;
        } else {
            // Transfer tokens directly to verified users
            _transfer(owner(), to, amount);
            return true;
        }
    }
    
    /**
     * @dev Unlock tokens for underage users who are now verified
     */
    function unlockUnderageTokens(address account) external onlyOwner {
        require(isKycVerified[account], "Account not KYC verified");
        require(block.timestamp >= underageUnlockTime[account], "Unlock time not reached");
        
        _unlockUnderageTokens(account);
    }
    
    /**
     * @dev Internal function to unlock tokens
     */
    function _unlockUnderageTokens(address account) internal {
        uint256 amount = underageLocked[account];
        if (amount > 0) {
            underageLocked[account] = 0;
            _transfer(owner(), account, amount);
            emit RewardsUnlocked(account, amount);
        }
    }
    
    /**
     * @dev See {IERC20-transfer}.
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-approve}.
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        
        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }
        
        return true;
    }
    
    /**
     * @dev See {IERC20-name}.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC20-symbol}.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC20-decimals}.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    /**
     * @dev Get locked balance for underage users
     */
    function lockedBalanceOf(address account) public view returns (uint256) {
        return underageLocked[account];
    }
    
    /**
     * @dev Get total balance (available + locked)
     */
    function totalBalanceOf(address account) public view returns (uint256) {
        return _balances[account] + underageLocked[account];
    }
    
    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    /**
     * @dev Creates `amount` tokens and assigns them to `account`.
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
    
    /**
     * @dev Moves `amount` tokens from `sender` to `recipient`.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        
        // Check if sender is KYC verified if required
        if (sender != owner() && !isKycVerified[sender]) {
            revert("Sender not KYC verified");
        }

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }
    
    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` tokens.
     */
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}

/**
 * @title FootballChessMarketplace
 * @dev Contract for trading FootballChess NFTs
 */
contract FootballChessMarketplace is Ownable {
    // Player card contract
    address public playerCardContract;
    
    // Team contract
    address public teamContract;
    
    // Reward token contract
    address public rewardTokenContract;
    
    // Listing status
    enum ListingStatus { Active, Sold, Cancelled }
    
    // Listing structure
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 price;
        ListingStatus status;
        address contractAddress; // Either player card or team contract
        uint256 listedAt;
    }
    
    // Listings by ID
    mapping(uint256 => Listing) public listings;
    uint256 private nextListingId = 1;
    
    // Fee percentage (in basis points, e.g. 250 = 2.5%)
    uint256 public feePercentage = 250;
    
    // Events
    event ItemListed(uint256 indexed listingId, address indexed seller, address contractAddress, uint256 tokenId, uint256 price);
    event ItemSold(uint256 indexed listingId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed listingId);
    event FeeUpdated(uint256 newFeePercentage);
    
    constructor(address _playerCardContract, address _teamContract, address _rewardTokenContract) {
        playerCardContract = _playerCardContract;
        teamContract = _teamContract;
        rewardTokenContract = _rewardTokenContract;
    }
    
    /**
     * @dev List a player card for sale
     * @param tokenId Player card token ID
     * @param price Price in reward tokens
     */
    function listPlayerCard(uint256 tokenId, uint256 price) external returns (uint256) {
        // Check if caller owns the token
        IERC721 playerContract = IERC721(playerCardContract);
        require(playerContract.ownerOf(tokenId) == msg.sender, "Not owner of token");
        
        // Check if marketplace is approved to transfer
        require(playerContract.isApprovedForAll(msg.sender, address(this)) ||
                playerContract.getApproved(tokenId) == address(this),
                "Marketplace not approved");
        
        // Create listing
        uint256 listingId = nextListingId++;
        listings[listingId] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            status: ListingStatus.Active,
            contractAddress: playerCardContract,
            listedAt: block.timestamp
        });
        
        emit ItemListed(listingId, msg.sender, playerCardContract, tokenId, price);
        
        return listingId;
    }
    
    /**
     * @dev List a team for sale
     * @param tokenId Team token ID
     * @param price Price in reward tokens
     */
    function listTeam(uint256 tokenId, uint256 price) external returns (uint256) {
        // Check if caller owns the token
        IERC721 teamContract_ = IERC721(teamContract);
        require(teamContract_.ownerOf(tokenId) == msg.sender, "Not owner of token");
        
        // Check if marketplace is approved to transfer
        require(teamContract_.isApprovedForAll(msg.sender, address(this)) ||
                teamContract_.getApproved(tokenId) == address(this),
                "Marketplace not approved");
        
        // Create listing
        uint256 listingId = nextListingId++;
        listings[listingId] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            status: ListingStatus.Active,
            contractAddress: teamContract,
            listedAt: block.timestamp
        });
        
        emit ItemListed(listingId, msg.sender, teamContract, tokenId, price);
        
        return listingId;
    }
    
    /**
     * @dev Buy a listed item
     * @param listingId Listing ID
     */
    function buyItem(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        
        require(listing.status == ListingStatus.Active, "Listing not active");
        require(listing.seller != msg.sender, "Cannot buy own listing");
        
        // Mark listing as sold
        listing.status = ListingStatus.Sold;
        
        // Calculate fee
        uint256 fee = (listing.price * feePercentage) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer tokens from buyer to seller and fee to contract owner
        IERC20 rewardToken = IERC20(rewardTokenContract);
        require(rewardToken.transferFrom(msg.sender, listing.seller, sellerAmount), "Token transfer to seller failed");
        require(rewardToken.transferFrom(msg.sender, owner(), fee), "Fee transfer failed");
        
        // Transfer NFT to buyer
        IERC721 nftContract = IERC721(listing.contractAddress);
        nftContract.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);
        
        emit ItemSold(listingId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Cancel a listing
     * @param listingId Listing ID
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        
        require(listing.seller == msg.sender || msg.sender == owner(), "Not seller or owner");
        require(listing.status == ListingStatus.Active, "Listing not active");
        
        listing.status = ListingStatus.Cancelled;
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Update marketplace fee percentage
     * @param _feePercentage New fee percentage in basis points
     */
    function updateFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _feePercentage;
        
        emit FeeUpdated(_feePercentage);
    }
    
    /**
     * @dev Get active listings within a range
     * @param start Start index
     * @param count Number of listings to return
     */
    function getActiveListings(uint256 start, uint256 count) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = start; i < start + count && resultIndex < count && i < nextListingId; i++) {
            if (listings[i].status == ListingStatus.Active) {
                result[resultIndex] = i;
                resultIndex++;
            }
        }
        
        return result;
    }
}
