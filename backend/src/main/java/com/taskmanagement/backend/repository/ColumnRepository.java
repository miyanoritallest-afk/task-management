package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ColumnRepository extends JpaRepository<BoardColumn, UUID> {

    @Query("SELECT DISTINCT c FROM BoardColumn c LEFT JOIN FETCH c.cards WHERE c.board.id = :boardId ORDER BY c.position ASC")
    List<BoardColumn> findByBoardIdWithCards(UUID boardId);

    @Query("SELECT c FROM BoardColumn c LEFT JOIN FETCH c.cards WHERE c.id = :id")
    Optional<BoardColumn> findByIdWithCards(UUID id);
}
