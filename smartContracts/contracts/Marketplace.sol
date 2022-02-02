// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LibroNFT.sol";

contract Marketplace is IERC721Receiver {
    using SafeMath for uint256;

    event Received(uint256 _tokenID, address _from);
    event Rented(uint256 _tokenID, address _to);
    event Added(uint256 _tokenID, uint256 _index);

    struct Book {
        bool isActive;
        uint256 tokenID;
    }
    uint256 public totalBooks;
    mapping(uint256 => Book) public booksAvailable; // index => tokenID

    LibroNFT tokenContract;

    constructor(address tokenAddress) {
        tokenContract = LibroNFT(tokenAddress);
    }

    function addBook(uint256 tokenID, address from) public {
        require(tokenContract.isLibrarian(from), "No autorizado");
        require(tokenContract.existTokenID(tokenID), "No existe ese tokenID");
        booksAvailable[totalBooks] = Book(true, tokenID); // Añadimos el libro disponible
        emit Added(tokenID, totalBooks);
        totalBooks = totalBooks.add(1); //Incrementamos el total de libros disponibles
    }

    function rentBook(uint256 _tokenID) public {
        uint256 index = getIndexByTokenID(_tokenID);
        require(tokenContract.existTokenID(_tokenID), "No existe ese tokenID");
        require(booksAvailable[index].isActive, "Must be active");
        booksAvailable[index].isActive = false;
        tokenContract.transferFrom(
            address(this),
            msg.sender,
            booksAvailable[index].tokenID
        );
        emit Rented(booksAvailable[index].tokenID, msg.sender);
    }

    function returnBook(uint256 _tokenID) public {
        require(tokenContract.existTokenID(_tokenID), "No existe ese tokenID");
        uint256 indexBook = getIndexByTokenID(_tokenID);
        tokenContract.transferFrom(msg.sender, address(this), _tokenID);
        booksAvailable[indexBook].isActive = true;

        emit Received(_tokenID, msg.sender);
    }

    //Me devuelve el libro activo en el indice indicado
    function getActiveBooksByIndex(uint256 index)
        public
        view
        returns (uint256)
    {
        uint256 j;
        for (uint256 i = 0; i < totalBooks; i++) {
            if (booksAvailable[i].isActive) {
                if (index == j) {
                    return i;
                }
                j += 1;
            }
        }
        return 0;
    }

    // Devuelve cuantos libros hay disponibles.
    function getActiveBooksCount() public view returns (uint256) {
        uint256 result;
        for (uint256 i = 0; i < totalBooks; i++) {
            if (booksAvailable[i].isActive) {
                result += 1;
            }
        }
        return result;
    }

    function getIndexByTokenID(uint256 _tokenID) public view returns (uint256) {
        require(tokenContract.existTokenID(_tokenID), "No existe ese tokenID");
        uint256 result; //Si ponemos el return dentro del for da un warning de posibilidad de no retornar nada
        bool find = false; //Para no continuar iterando sin necesidad
        for (uint256 i = 0; i < totalBooks && find == false; i++) {
            if (booksAvailable[i].tokenID == _tokenID) {
                result = i;
                find = true;
            }
        }
        return result;
    }

    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) external pure override returns (bytes4) {
        _operator;
        _from;
        _tokenId;
        _data;
        return 0x150b7a02;
    }
}
