package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "flashcard_decks")
public class FlashcardDeck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    private String category;

    @Column(name = "category_label")
    private String categoryLabel;

    @Column(name = "cards_count")
    private Integer cardsCount;

    private Integer mastery;

    @Column(name = "last_reviewed")
    private String lastReviewed;

    @Column(name = "cards_json", columnDefinition = "LONGTEXT")
    private String cardsJson;

    public FlashcardDeck() {}

    public FlashcardDeck(Long userId, String title, String description, String category, String categoryLabel, Integer cardsCount, Integer mastery, String lastReviewed, String cardsJson) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.categoryLabel = categoryLabel;
        this.cardsCount = cardsCount;
        this.mastery = mastery;
        this.lastReviewed = lastReviewed;
        this.cardsJson = cardsJson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public Integer getCardsCount() {
        return cardsCount;
    }

    public void setCardsCount(Integer cardsCount) {
        this.cardsCount = cardsCount;
    }

    public Integer getMastery() {
        return mastery;
    }

    public void setMastery(Integer mastery) {
        this.mastery = mastery;
    }

    public String getLastReviewed() {
        return lastReviewed;
    }

    public void setLastReviewed(String lastReviewed) {
        this.lastReviewed = lastReviewed;
    }

    public String getCardsJson() {
        return cardsJson;
    }

    public void setCardsJson(String cardsJson) {
        this.cardsJson = cardsJson;
    }
}
