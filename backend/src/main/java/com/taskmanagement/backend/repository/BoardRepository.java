package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID> {

    @Query("SELECT DISTINCT b FROM Board b LEFT JOIN FETCH b.columns c LEFT JOIN FETCH c.cards ORDER BY b.createdAt ASC")
    List<Board> findAllWithColumns();

    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.columns c LEFT JOIN FETCH c.cards WHERE b.id = :id")
    Optional<Board> findByIdWithColumns(UUID id);
}
