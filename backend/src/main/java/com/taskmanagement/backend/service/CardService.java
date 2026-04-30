package com.taskmanagement.backend.service;

import com.taskmanagement.backend.entity.BoardColumn;
import com.taskmanagement.backend.entity.Card;
import com.taskmanagement.backend.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CardService {

    private final CardRepository cardRepository;
    private final ColumnService columnService;

    public CardService(CardRepository cardRepository, ColumnService columnService) {
        this.cardRepository = cardRepository;
        this.columnService = columnService;
    }

    @Transactional(readOnly = true)
    public List<Card> findByColumn(UUID columnId) {
        return cardRepository.findByColumnIdOrderByPositionAsc(columnId);
    }

    @Transactional(readOnly = true)
    public Card findById(UUID id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found: " + id));
    }

    public Card create(UUID columnId, Card card) {
        BoardColumn column = columnService.findById(columnId);
        card.setColumn(column);
        return cardRepository.save(card);
    }

    public Card update(UUID id, Card patch) {
        Card existing = findById(id);
        // title は必須フィールドのため null の場合はスキップ
        if (patch.getTitle() != null) {
            existing.setTitle(patch.getTitle());
        }
        // nullable フィールドは null も含めて上書き（null = クリア操作）
        existing.setDescription(patch.getDescription());
        existing.setDueDate(patch.getDueDate());
        existing.setColor(patch.getColor());
        // priority と position は null の場合はスキップ（未指定扱い）
        if (patch.getPriority() != null) {
            existing.setPriority(patch.getPriority());
        }
        if (patch.getPosition() != null) {
            existing.setPosition(patch.getPosition());
        }
        return cardRepository.save(existing);
    }

    public Card moveToColumn(UUID cardId, UUID newColumnId) {
        Card card = findById(cardId);
        BoardColumn newColumn = columnService.findById(newColumnId);
        card.setColumn(newColumn);
        return cardRepository.save(card);
    }

    public void delete(UUID id) {
        Card existing = findById(id);
        cardRepository.delete(existing);
    }
}
