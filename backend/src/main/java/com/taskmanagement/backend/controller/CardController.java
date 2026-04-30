package com.taskmanagement.backend.controller;

import com.taskmanagement.backend.entity.Card;
import com.taskmanagement.backend.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/columns/{columnId}/cards")
    public ResponseEntity<List<Card>> getByColumn(@PathVariable UUID columnId) {
        return ResponseEntity.ok(cardService.findByColumn(columnId));
    }

    @GetMapping("/cards/{id}")
    public ResponseEntity<Card> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(cardService.findById(id));
    }

    @PostMapping("/columns/{columnId}/cards")
    public ResponseEntity<Card> create(
            @PathVariable UUID columnId,
            @Valid @RequestBody Card card) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.create(columnId, card));
    }

    @PatchMapping("/cards/{id}")
    public ResponseEntity<Card> update(@PathVariable UUID id, @RequestBody Card patch) {
        return ResponseEntity.ok(cardService.update(id, patch));
    }

    @PatchMapping("/cards/{id}/move")
    public ResponseEntity<Card> move(@PathVariable UUID id, @RequestParam UUID columnId) {
        return ResponseEntity.ok(cardService.moveToColumn(id, columnId));
    }

    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        cardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
