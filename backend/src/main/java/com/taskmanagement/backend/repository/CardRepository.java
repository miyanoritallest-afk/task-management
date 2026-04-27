package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {

    List<Card> findByColumnIdOrderByPositionAsc(UUID columnId);
}
